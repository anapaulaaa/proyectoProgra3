import {Router} from "express";
import pool from "../bd.js";

const router = Router();

//GET Ruta para obteber los pedidos 
router.get('/', async(req,res) =>{
    try{
        const[rows] = await pool.query("SELECT * FROM pedidos");
        res.json(rows);
        }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

// POST Ruta para crear un pedido
router.post('/', async (req, res) => {
  const { usuario_id, total, estado, direccion_entrega } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO pedidos (usuario_id,total,estado,direccion_entrega) VALUES (?,?,?,?)",
      [usuario_id, total, estado, direccion_entrega]
    );
    res.json({ message: "Pedido creado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
});

// PUT ruta para actualizar un pedido 
router.put('/:id', async (req, res) => {
  const { id } = req.params; // ID en la URL    
    const { estado } = req.body; // datos enviados en el body
    try {
      const [result] = await pool.query(
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [estado, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar    :', error);
      res.status(500).send('Error al actualizar pedido');
    }
});

// DELETE Ruta para eliminar un pedido
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // ID en la URL
  try {
    const [result] = await pool.query('DELETE FROM pedidos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).send('Error al eliminar pedido');
  }
});

export default router;