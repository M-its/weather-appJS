export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { q, units, lang } = req.query

    if (!q) {
        return res.status(400).json({ error: "Parâmetro 'q' (cidade) é obrigatório." })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
        return res.status(500).json({ error: "API key não configurada no servidor." })
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${apiKey}&lang=${lang || "pt_br"}&units=${units || "metric"}`

    try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || "Erro ao buscar previsão." })
        }

        res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate")
        return res.status(200).json(data)
    } catch (error) {
        console.error("Erro na função serverless /api/forecast:", error)
        return res.status(500).json({ error: "Erro interno ao buscar previsão do tempo." })
    }
}