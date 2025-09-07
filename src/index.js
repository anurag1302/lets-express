import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(200).send({ message: "Hello Express JS" });
});

app.get("/api/users", (request, response) => {
  response.send([
    { id: 1, username: "anurag", department: "IT" },
    { id: 2, username: "john", department: "Finance" },
    { id: 3, username: "jack", department: "HR" },
  ]);
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 110, name: "CPU", price: 100 },
    { id: 112, name: "mouse", price: 25 },
  ]);
});
