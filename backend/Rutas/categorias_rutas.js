import { Router } from "express";
import pool from "../bd.js";

const router = Router();

//GET Ruta para obtener las categorias 
router.get('/', async(req,res) =>{
    try{
        const[rows] = await pool.query("SELECT * FROM categorias");
        res.json(rows);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorias' });
    }
})

// POST Ruta para crear una categoria
router.post('/', async (req, res) => {              
    const { id, nombre } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO categorias (id, nombre) VALUES (?, ?)',
        [id, nombre]
      );
      res.json({ message: 'Categoría creada', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la categoría' });               
    }
});

// PUT Ruta para actualizar una categoria
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE categorias SET nombre = ? WHERE id = ?',
            [nombre, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
});

// DELETE Ruta para eliminar una categoria
router.delete('/:id', async (req, res) => {
    const { id } = req.params;          
    try {
        const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        console.error(error);
        res .status(500).json({ error: 'Error al eliminar la categoría' });
    }                   
});

export default router;
