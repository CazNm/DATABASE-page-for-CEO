var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var server = http.createServer(app);
var fs = require("fs");
var url = require("url");
var mysql = require("mysql2/promise");
var login = require("./routes/login");
var ejs = require("ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/", login);

//call mysql module

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "movie"
});

//login function from login html
app.post("/", async function(req, res) {
    var name = req.body.name;
    var pwd = req.body.pwd;
    var qr = `select * from user where userID = ?`;

    var connection = await pool.getConnection(async conn => conn);

    var [results] = await connection.query(qr, [name]);

    console.log(results);
    if (results.length === 0) {
        connection.release();
        res.render("login.ejs", { alert: true }); //using absolute path for sendFile
        console.log("no-id");
    } else {
        var db_pwd = results[0].userPW;
        var chk_qr = `select * from user where userID = ?`;
        var [result] = await connection.query(chk_qr, [name]);

        if (!result[0].state) {
            if (pwd === db_pwd) {
                console.log("open main.html");
                connection.release();
                res.render("main.ejs", { username: "ADMIN" });
            } else {
                connection.release();
                res.render("login.ejs", { alert: true });
            }
        } else {
            connection.release();
            res.render("login.ejs", { alert: true });
        }
    }
});

app.post("/database", async function(req, res) {
    var value = req.body.rn;
    var connection = await pool.getConnection(async conn => conn);

    if (value === "0") {
        //value of settlement
        var qr = "select * from settlement";
        var qr_po = "select * from point where branch_id = ?";

        var array_date = new Array();
        var array_price = new Array();
        var array_reg = new Array();
        var array_city = new Array();

        var [rows] = await connection.query(qr);

        for (var i = 0; i < rows.length; i++) {
            array_date[i] = rows[i].date;
            array_price[i] = rows[i].day_price;
            var point = rows[i].branch_id;

            var [result] = await connection.query(qr_po, [point]);

            array_reg[i] = result[0].branch_region;
            array_city[i] = result[0].branch_city;
            console.log(result[0].branch_region + "/" + result[0].branch_city);
        }

        for (var i = 0; i < rows.length; i++) {
            console.log(array_city[i]);
        }
        connection.release();
        res.render("content.ejs", {
            username: "ADMIN",
            data_name: "결산",
            data_st: array_date,
            data_nd: array_price,
            data_rd: array_reg,
            data_fr: array_city,
            data_fiv: 0,
            data_six: 0,
            data_type: 0
        });
    } else if (value === "1") {
        //value of fac
        var qr = "select * from theater_fac";
        var info_qr = "select * from theater_info where theater_id = ?";
        var info_br = "select * from point where branch_id = ?";

        var data_th_reg = new Array();
        var data_th_city = new Array();
        var data_th = new Array();
        var data_i_seat = new Array();
        var data_i_screen = new Array();
        var data_i_fext = new Array();
        var bc_id = new Array();

        var [result] = await connection.query(qr);

        for (var i = 0; i < result.length; i++) {
            var [res_info] = await connection.query(
                info_qr,
                result[i].theater_id
            );

            bc_id[i] = res_info[0].branch_id;

            data_i_seat[i] = result[i].seat;
            data_i_screen[i] = result[i].screen;
            data_i_fext[i] = result[i].fire_ext;
            data_th[i] = res_info[0].theater_num;
        }

        for (var i = 0; i < result.length; i++) {
            var [res_info] = await connection.query(info_br, [bc_id[i]]);

            data_th_reg[i] = res_info[0].branch_region;
            data_th_city[i] = res_info[0].branch_city;
        }

        console.log(result); //내부시설 상영관 id/시설물

        connection.release();

        res.render("content.ejs", {
            username: "ADMIN",
            data_name: "내부시설",
            data_st: data_th_reg,
            data_nd: data_th_city,
            data_rd: data_th,
            data_fr: data_i_seat,
            data_fiv: data_i_screen,
            data_six: data_i_fext,
            data_type: 1
        });
    }
});

app.post("/login", function(req, res) {
    2;
    var userID = req.body.id;
    var userPW = req.body.pw;
});

server.listen(3000, function() {
    console.log("server starting with 3000");
});
