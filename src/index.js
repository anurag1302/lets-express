import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: "anurag", department: "IT" },
  { id: 2, username: "john", department: "Finance" },
  { id: 3, username: "jack", department: "HR" },
];

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

app.get("/", (request, response) => {
  response
    .status(200)
    .send({ message: "Hello from Express JS & Prism & Postgres" });
});

//Query Params
app.get("/api/users", async (request, response) => {
  const { filter, value } = request.query;
  console.log(`filter & value = ${filter} ${value}`);
  const dbUsers = await prisma.users.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
  });
  console.log(dbUsers);
  if (filter && value) {
    const arr = dbUsers.filter((user) => {
      const field = user[filter];
      if (typeof field === "string") {
        return field.toLowerCase().includes(value.toLowerCase());
      }
    });
    console.log(arr);
    return response.send(arr);
  }
  response.send(dbUsers);
});

//Request Params
app.get("/api/users/:id", (request, response) => {
  const params = request.params;
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return response.status(400).send({ message: "Bad Request" });
  }
  const findUser = users.find((user) => user.id === id);
  if (!findUser) {
    return response.status(404).send({ message: "User Not Found" });
  }
  response.send(findUser);
});

//POST
app.post("/api/users", async (request, response) => {
  const body = request.body;
  const dbUsers = await prisma.users.findMany();
  const maxIndex = dbUsers.length;
  console.log(`MaxIndex - ${maxIndex}`);
  const newUser = await prisma.users.create({
    data: {
      id: maxIndex + 1,
      username: body.username,
      department: body.department,
    },
  });
  response
    .status(201)
    .send({ message: "User Created Successfully", data: newUser });
});

//PUT
app.put("/api/users/:id", async (request, response) => {
  const params = request.params;
  const id = parseInt(params.id);
  const { username, department } = request.body;

  if (!username || !department) {
    return response
      .status(400)
      .send({ message: "username & department are required" });
  }

  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  console.log(`User: ${user}`);

  if (!user) {
    return response.status(404).send({ message: "USER NOT FOUND" });
  } else {
    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: {
        username: username,
        department: department,
      },
    });
    return response
      .status(200)
      .send({ message: "User Updated Successfully", data: updatedUser });
  }
});

//PATCH
app.patch("/api/users/:id", async (request, response) => {
  const params = request.params;
  const id = parseInt(params.id);
  const updatedBody = request.body;

  if (!updatedBody || Object.keys(updatedBody).length == 0) {
    return response
      .status(400)
      .send({ message: "No Request Body to be updated" });
  }

  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  if (!user) {
    return response.status(404).send({ message: "User Not Found" });
  }

  const updatedUser = await prisma.users.update({
    where: { id: id },
    data: updatedBody,
  });
  response
    .status(200)
    .send({ message: "Partial Updates Done", data: updatedUser });
});

//DELETE
app.delete("/api/users/:id", async (request, response) => {
  const params = request.params;
  const id = parseInt(params.id);

  const user = await prisma.users.findUnique({
    where: { id: id },
  });

  if (!user) {
    return response.status(404).send({ message: "User Not Found" });
  }

  const deletedUser = await prisma.users.delete({
    where: { id: id },
  });

  response
    .status(200)
    .send({ message: "DELETION SUCCESSFUL", user: deletedUser });
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 110, name: "CPU", price: 100 },
    { id: 112, name: "mouse", price: 25 },
  ]);
});
