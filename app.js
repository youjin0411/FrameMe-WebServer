const express = require('express');
const mysql = require('mysql2');
const config = require('./config');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const connection = mysql.createConnection(config);
// 데이터 삽입 
app.post('/api/insert', (req, res) => {
    // 클라이언트로부터 전달받은 사용자 정보
    const { name, today, time, qrCodeImage, frameimage } = req.body;

    // TODO: 데이터베이스에 데이터 삽입 로직 구현
    const query = 'INSERT INTO gallery (name, day, time, qr, frame) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, today, time, qrCodeImage, frameimage], (error, results) => {
        if (error) {
            console.error('삽입 중 오류 발생:', error);
            res.status(500).json({ error: '삽입에 실패했습니다.' });
        }
        console.log('성공:', results);
        res.json({ message: '성공적으로 완료되었습니다.' });
    });
});

// 데이터 조회
app.get('/api/select', (req, res) => {
    // 실제 로그인 검증 로직
    const query = ' select * from gallery'
    connection.query(query, (err, results) => {
        if (err) {
            console.error('데이터베이스 조회 오류:', err);
            res.status(500).json({ message: '서버 오류' });
            return;
        }
        res.json({ message: '성공적으로 완료되었습니다.', results: results })
    })
});

connection.connect((error) => {
    if (error) {
        console.error('데이터베이스 연결 실패:', error);
        return;
    }
    console.log('데이터베이스에 연결되었습니다.');
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
});