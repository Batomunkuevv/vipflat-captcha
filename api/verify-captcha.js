import fetch from "node-fetch";

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send({ message: "Method Not Allowed" });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ success: false, message: "Token is required" });
    }

    const secretKey = "6LduepoqAAAAAPSe_OIORcfu-V3oLeuWQAj9ySQg";

    try {

        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        if (data.success) {
            res.status(200).send({ success: true, message: "Verification successful" });
        } else {
            res.status(400).send({ success: false, message: "Verification failed", data });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Server error", error });
    }
};
