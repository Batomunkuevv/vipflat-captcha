export default async (req, res) => {
    // Динамический импорт модуля 'node-fetch'
    const { default: fetch } = await import('node-fetch');

    // Заголовки CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Обработка запроса OPTIONS для preflight CORS
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).send({ message: "Method Not Allowed" });
    }

    const { token } = req.body;

    if (!token) {
        console.error("No token provided");
        return res.status(400).send({ success: false, message: "Token is required" });
    }

    const secretKey = "6LduepoqAAAAAPSe_OIORcfu-V3oLeuWQAj9ySQg"; // Замените на ваш секретный ключ reCAPTCHA

    try {
        // Отправка запроса к Google для проверки токена reCAPTCHA
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        if (data.success) {
            return res.status(200).send({ success: true, message: "Verification successful" });
        } else {
            return res.status(400).send({ success: false, message: "Verification failed", data });
        }
    } catch (error) {
        console.error("Error during reCAPTCHA verification:", error);
        return res.status(500).send({ success: false, message: "Server error", error });
    }
};
