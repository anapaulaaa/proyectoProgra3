import {Router} from 'express';
import pool from '../bd.js';

const router = Router();

// GET ruta para obtener los productos 
router.get('/', async (req,res) => {
    try { 
         const[rows]= await pool.query("SELECT * FROM productos");
        res.json(rows);
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// POST Ruta para crear un producto 
router.post('/',async(req,res) => {
    const{id,categoria_id,nombre,descripcion,precio,imagen, disponible} =req.body;
    try{
        const[result] = await pool.query("INSERT INTO productos (id,categoria_id,nombre,descripcion,precio,imagen,disponible)VALUES (?,?,?,?,?,?,?)", [id,categoria_id,nombre,descripcion,precio,imagen,disponible]);    
        res.json(result);
    }catch (error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
})
// PUT Ruta para actualizar un producto
router.put('/:id', async (req,res) => {
    const {id} = req.params;
    const{categoria_id,nombre,descripcion,precio,imagen,disponible} = req.body;
    try{
        const[result]= await pool.query('UPDATE productos SET categoria_id =?, nombre=?, descripcion=?, precio=?, imagen=?, disponible=? WHERE id=?', 
            [categoria_id,nombre,descripcion,precio,imagen,disponible,id]
        );
            if(result.affectedRows > 0){
                res.json({message: 'Producto actualizado correctamente'});
            } else {
                res.status(404).json({error: 'Producto no encontrado'});
            }
    }catch (error){
        console.error(error);
        res.status(500).json({error: error.message});
    }
});
// DELETE Ruta para eliminar un producto 
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // ID en la URL

  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).send('Error al eliminar producto');
  }
});
export default router;