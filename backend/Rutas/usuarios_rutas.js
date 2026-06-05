import { Router } from "express";
import pool from "../bd.js";

const router = Router();

 //GET Ruta para obtener los usuarios
router.get("/", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM usuarios");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//POST Ruta para crear un usuario
router.post("/", async(req,res) => {
   const {id, nombre, email, password, rol, telefono} = req.body;
    try {
         
         const [result] = await pool.query("INSERT INTO usuarios (id, nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)", [id, nombre, email, password, rol, telefono]);
         res.json(result);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }   
})

//PUT Ruta para actualizar un usuario 
router.put('/:id', async (req, res) => {
  const { id } = req.params; // ID en la URL
  const { nombre, email, password, rol, telefono } = req.body; // datos enviados en el body

  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?, telefono = ? WHERE id = ?',
      [nombre, email, password, rol, telefono, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).send('Error al actualizar usuario');
  }
});

//DELETE Ruta para eliminar un usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // ID en la URL

  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).send('Error al eliminar usuario');
  }
});

export default router;