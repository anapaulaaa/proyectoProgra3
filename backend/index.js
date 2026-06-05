import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');

    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );

    next();

});

// CONEXION MYSQL
async function connectDB() {

    try {

        const connection = await mysql.createConnection({

            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME

        });

        console.log("Conexion funcionando");

        return connection;

    } catch (error) {

        console.log("Error conexion", error);

    }

}

// ============================================================
// USUARIOS
// ============================================================

// OBTENER TODOS
app.get("/api/user", async (req, res) => {

    try {

        const connection = await connectDB();

        const [rows] = await connection.query(
            "SELECT * FROM usuarios"
        );

        await connection.end();

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// OBTENER POR ID
app.get("/api/users/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const [rows] = await connection.query(
            "SELECT * FROM usuarios WHERE id = ?",
            [id]
        );

        await connection.end();

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// AGREGAR
app.post("/api/users", async (req, res) => {

    try {

        const connection = await connectDB();

        const {
            nombre,
            email,
            password,
            rol,
            telefono
        } = req.body;

        const [result] = await connection.query(

            `INSERT INTO usuarios
            (nombre,email,password,rol,telefono)
            VALUES (?,?,?,?,?)`,

            [nombre,email,password,rol,telefono]

        );

        await connection.end();

        res.json({
            success: true,
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// EDITAR
app.put("/api/users/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const {
            nombre,
            email,
            rol,
            telefono
        } = req.body;

        const [currentRows] = await connection.query(
            "SELECT nombre, email, rol, telefono FROM usuarios WHERE id = ?",
            [id]
        );

        const current = currentRows[0] || {};
        const nombreFinal = nombre ?? current.nombre;
        const emailFinal = email ?? current.email;
        const rolFinal = rol ?? current.rol;
        const telefonoFinal = telefono ?? current.telefono;

        const [result] = await connection.query(

            `UPDATE usuarios
             SET nombre = ?, email = ?, rol = ?, telefono = ?
             WHERE id = ?`,

            [nombreFinal, emailFinal, rolFinal, telefonoFinal, id]

        );

        await connection.end();

        res.json({
            success: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ELIMINAR
app.delete("/api/users/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        await connection.query(

            "DELETE FROM usuarios WHERE id = ?",

            [id]

        );

        await connection.end();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ============================================================
// PRODUCTOS
// ============================================================

// OBTENER TODOS
app.get("/api/productos", async (req, res) => {

    try {

        const connection = await connectDB();

        const [rows] = await connection.query(
            "SELECT * FROM productos"
        );

        await connection.end();

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// OBTENER POR ID
app.get("/api/productos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const [rows] = await connection.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        await connection.end();

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// AGREGAR
app.post("/api/productos", async (req, res) => {

    try {

        const connection = await connectDB();

        const {
            nombre,
            categoria_id,
            descripcion,
            precio,
            imagen,
            disponible
        } = req.body;

        await connection.query(

            `INSERT INTO productos
            (nombre, categoria_id, descripcion, precio, imagen, disponible)
            VALUES (?,?,?,?,?,?)`,

            [nombre, categoria_id, descripcion, precio, imagen, disponible]

        );

        await connection.end();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// EDITAR
app.put("/api/productos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const {
            nombre,
            categoria_id,
            descripcion,
            precio,
            imagen,
            disponible
        } = req.body;

        const [result] = await connection.query(

            `UPDATE productos
             SET nombre = ?, categoria_id = ?, descripcion = ?,
                 precio = ?, imagen = ?, disponible = ?
             WHERE id = ?`,

            [nombre, categoria_id, descripcion, precio, imagen, disponible, id]

        );

        await connection.end();

        res.json({
            success: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ELIMINAR
app.delete("/api/productos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        await connection.query(

            "DELETE FROM productos WHERE id = ?",

            [id]

        );

        await connection.end();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ============================================================
// PEDIDOS
// ============================================================

// OBTENER TODOS
app.get("/api/pedidos", async (req, res) => {

    try {

        const connection = await connectDB();

        const [rows] = await connection.query(
            `SELECT p.*, u.nombre AS usuario_nombre, u.email AS usuario_email
             FROM pedidos p
             LEFT JOIN usuarios u ON u.id = p.usuario_id`
        );

        await connection.end();

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// OBTENER POR ID
app.get("/api/pedidos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const [rows] = await connection.query(
            `SELECT p.*, u.nombre AS usuario_nombre, u.email AS usuario_email
             FROM pedidos p
             LEFT JOIN usuarios u ON u.id = p.usuario_id
             WHERE p.id = ?`,
            [id]
        );

        await connection.end();

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// AGREGAR
app.post("/api/pedidos", async (req, res) => {

    try {

        const connection = await connectDB();

        const {
            usuario_id,
            total,
            estado,
            direccion_entrega
        } = req.body;

        await connection.query(

            `INSERT INTO pedidos
            (usuario_id, total, estado, direccion_entrega)
            VALUES (?,?,?,?)`,

            [usuario_id, total, estado, direccion_entrega]

        );

        await connection.end();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// EDITAR
app.put("/api/pedidos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        const {
            usuario_id,
            total,
            estado,
            direccion_entrega
        } = req.body;

        const [result] = await connection.query(

            `UPDATE pedidos
             SET usuario_id = ?, total = ?, estado = ?, direccion_entrega = ?
             WHERE id = ?`,

            [usuario_id, total, estado, direccion_entrega, id]

        );

        await connection.end();

        res.json({
            success: true,
            result
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ELIMINAR
app.delete("/api/pedidos/:id", async (req, res) => {

    try {

        const connection = await connectDB();

        const { id } = req.params;

        await connection.query(

            "DELETE FROM pedidos WHERE id = ?",

            [id]

        );

        await connection.end();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// ============================================================

const port = process.env.PORT || 3001;

app.get("/api/categorias", async (req, res) => {
 
    try {
 
        const connection = await connectDB();
 
        const [rows] = await connection.query(
            "SELECT * FROM categorias"
        );
 
        await connection.end();
 
        res.json({
            success: true,
            data: rows
        });
 
    } catch (error) {
 
        res.status(500).json({
            success: false,
            error: error.message
        });
 
    }
 
});


app.listen(port, () => {

    console.log(`Servidor corriendo en puerto ${port}`);

});