const { Router } = require('express');
const admin = require("../credentials");
const router = Router()
const db = admin.firestore();
// insertar registros 
router.post("/api/frequencyquestions", async(req, res) => {
    try {
        await db.collection("frequentQuestions")
            .doc('/' + req.body.id + '/')
            .create({
                answer: req.body.answer,
                ask: req.body.ask,
                idPortal: req.body.idPortal,
                url: req.body.url
            });

        return res.status(204).json();
    } catch (error) {
        return res.status(500).send(error);
    }
})

//consultar registros de una colección 
router.post("/api/certificado/:iddoccert", async(req, res) => { //Este es el codigo que necesitamos, ahora toca sacar el dato necesario
    try {
        const doc = db.collection('Certificado').doc(req.params.iddoccert)
        const certificados = await doc.get();
        const docCertificado = "Este es el certificado de: " + certificados.data().idEstudiante +
            ". Se genera el siguiente certificado: " + certificados.data().docCertificado;
        return res.status(200).json(docCertificado);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//multi consulta de registros 
router.post("/api/multifreqquest", async(req, res) => {
    try {
        const query = db.collection('frequentQuestions');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            answer: doc.data().answer,
        }));


        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});


//eliminar registros 
router.delete("/api/eliminar/:idfreqquest", async(req, res) => {
    try {
        const document = db.collection("frequentQuestions").doc(req.params.idfreqquest);
        await document.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error);
    }
});

//actualizar registros 
router.put("/api/actualizar/:idfreqquest", async(req, res) => {
    try {
        const document = db.collection("frequentQuestions").doc(req.params.idfreqquest);
        await document.update({
            idPortal: req.body.idPortal,
        });
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router