const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors({
    origin: [
        'https://bankis.kiev.ua',
        'https://www.bankis.kiev.ua',
        'http://localhost:5173'
    ]
}))
app.use(express.json())

const nodemailer = require('nodemailer') //

const SPREADSHEET_ID = process.env.SPREADSHEET_ID

const parseSheetJson = (raw) => JSON.parse(raw.substring(47).slice(0, -2))

const normalizeHeader = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')

const getColumnIndex = (cols, names) => {
    const normalizedLabels = cols.map((col) => normalizeHeader(col?.label))
    for (const name of names) {
        const index = normalizedLabels.indexOf(normalizeHeader(name))
        if (index !== -1) return index
    }
    return -1
}

const getCellValue = (row, index) => {
    if (index < 0 || !row?.c) return undefined
    const cell = row.c[index]
    if (!cell) return undefined
    if (cell.v !== undefined && cell.v !== null) return cell.v
    return cell.f
}

const isHeaderRow = (productId, label) => {
    const normalizedId = normalizeHeader(productId)
    const normalizedLabel = normalizeHeader(label)
    return normalizedId === 'product_id' || normalizedLabel === 'spec_name'
}

app.get('/api/categories', async (req, res) => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=categories`
        const response = await axios.get(url)
        const json = parseSheetJson(response.data)
        const rows = json.table.rows
        const categories = rows.map(row => ({
            id: row.c[0]?.v,
            name: row.c[1]?.v,
            slug: row.c[2]?.v,
            order: row.c[3]?.v,
        }))
        res.json(categories)
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання категорій' })
    }
})

app.get('/api/products', async (req, res) => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=products`
        const response = await axios.get(url)
        const json = parseSheetJson(response.data)
        const rows = json.table.rows
        const isVisibleProduct = (value) =>
            value === true || value === 1 || value === '1' || value === 'TRUE' || value === 'true'

        const products = rows.map(row => {
            const hasShortDescriptionColumn = row.c[7] !== undefined

            return {
                // New products sheet format:
                // id, category_id, name, short_description, description, price, image_url, visible
                // Fallback supports old format without short_description.
                id: row.c[0]?.v,
                category_id: row.c[1]?.v,
                name: row.c[2]?.v,
                short_description: row.c[3]?.v,
                description: hasShortDescriptionColumn ? row.c[4]?.v : row.c[3]?.v,
                price: hasShortDescriptionColumn ? row.c[5]?.v : row.c[4]?.v,
                image_url: hasShortDescriptionColumn ? row.c[6]?.v : row.c[5]?.v,
                visible: hasShortDescriptionColumn ? row.c[7]?.v : row.c[6]?.v,
            }
        }).filter(p => isVisibleProduct(p.visible))
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання товарів' })
    }
})

app.get('/api/specs', async (req, res) => {
    try {
        const sheetName = process.env.SPEC_SHEET_NAME || 'specs'
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
        const response = await axios.get(url)
        const json = parseSheetJson(response.data)
        const rows = json.table.rows || []
        const cols = json.table.cols || []

        const productIdIndex = getColumnIndex(cols, ['product_id'])
        const specNameIndex = getColumnIndex(cols, ['spec_name'])
        const specValueIndex = getColumnIndex(cols, ['spec_value'])
        const orderIndex = getColumnIndex(cols, ['order', 'sort'])
        const visibleIndex = getColumnIndex(cols, ['visible', 'show'])

        if (productIdIndex === -1 || specNameIndex === -1 || specValueIndex === -1) {
            console.warn(
                `Лист ${sheetName}: потрібні колонки product_id, spec_name, spec_value. Повертаємо порожній список.`,
            )
            return res.json([])
        }

        const isVisibleSpec = (value) =>
            value === undefined ||
            value === null ||
            value === '' ||
            value === true ||
            value === 1 ||
            value === '1' ||
            value === 'TRUE' ||
            value === 'true'

        const specs = rows
            .map((row) => {
                const product_id = getCellValue(row, productIdIndex)
                const label = getCellValue(row, specNameIndex)
                const value = getCellValue(row, specValueIndex)
                const order = getCellValue(row, orderIndex) ?? 0
                const visible = getCellValue(row, visibleIndex)

                return {
                    product_id,
                    label,
                    value,
                    order,
                    visible,
                }
            })
            .filter(
                (spec) =>
                    spec.product_id !== undefined &&
                    spec.product_id !== null &&
                    spec.label &&
                    spec.value &&
                    !isHeaderRow(spec.product_id, spec.label) &&
                    isVisibleSpec(spec.visible),
            )
            .sort((a, b) => Number(a.order) - Number(b.order))

        res.json(specs)
    } catch (error) {
        console.error('Помилка /api/specs:', error.message)
        res.status(500).json({ error: 'Помилка отримання характеристик' })
    }
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

app.post('/api/contact', async (req, res) => {
    const { name, phone, comment, product } = req.body
    console.log('Отримано запит:', { name, phone, comment, product })

    try {
        console.log('Відправляємо email...')
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `Замовлення консультації — ${product}`,
            html: `
        <h2>Нове замовлення консультації</h2>
        <p><strong>Товар:</strong> ${product}</p>
        <p><strong>Ім'я:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Коментар:</strong> ${comment || 'немає'}</p>
      `
        })
        console.log('Email відправлено!')
        res.json({ success: true })
    } catch (error) {
        console.error('Помилка відправки:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// це має бути останнім!
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`)
})
