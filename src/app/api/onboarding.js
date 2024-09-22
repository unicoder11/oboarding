import { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import formidable from 'formidable'
import fs from 'fs'

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'tu_usuario', // Reemplaza con tu usuario de PostgreSQL
  host: 'localhost',  // Reemplaza con la dirección de tu servidor PostgreSQL
  database: 'tu_base_de_datos', // Reemplaza con el nombre de tu base de datos
  password: 'tu_contraseña', // Reemplaza con tu contraseña de PostgreSQL
  port: 5432, // Puerto por defecto de PostgreSQL
})

// Deshabilitar el análisis automático del cuerpo para manejar archivos
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req = NextApiRequest, res = NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()
    form.uploadDir = './public/uploads'  // Directorio para guardar archivos
    form.keepExtensions = true  // Mantener las extensiones de archivo originales

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error al procesar el formulario' })
      }

      const { nome, cpf } = fields
      const documentoFotoPath = files.documentoFoto ? files.documentoFoto.path : null
      const selfiePath = files.selfie ? files.selfie.path : null

      try {
        // Conexión a la base de datos y ejecución del INSERT
        const client = await pool.connect()

        const query = `
          INSERT INTO onboarding (nome, cpf, documento_foto, selfie)
          VALUES ($1, $2, $3, $4)
        `

        await client.query(query, [nome, cpf, documentoFotoPath, selfiePath])
        client.release()

        res.status(200).json({ message: 'Dados guardados com sucesso!' })
      } catch (error) {
        console.error('Error ao salvar dados no banco de dados:', error)
        res.status(500).json({ message: 'Erro ao salvar dados no banco de dados' })
      }
    })
  } else {
    res.status(405).json({ message: 'Método não permitido' })
  }
}
