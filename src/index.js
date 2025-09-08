import express from "express";

const app = express();

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
  response.status(200).send({ message: "Hello Express JS" });
});

//Query Params
app.get("/api/users", (request, response) => {
  const { filter, value } = request.query;
  console.log(`filter & value = ${filter} ${value}`);
  if (filter && value) {
    const arr = users.filter((user) => {
      const field = user[filter];
      if (typeof field === "string") {
        return field.toLowerCase().includes(value.toLowerCase());
      }
    });
    console.log(arr);
    return response.send(arr);
  }
  response.send(users);
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
app.post("/api/users", (request, response) => {
  const body = request.body;
  users.push({
    id: users.length + 1,
    username: body.username,
    department: body.department,
  });
  response.status(201).send(users);
});

//PUT
app.put("/api/users/:id", (request, response) => {
  const params = request.params;
  const id = parseInt(params.id);
  const body = request.body;

  console.log(`type of ${id} =`, typeof id);

  const user = users.find((usr) => usr.id === id);
  if (!user) {
    return response.status(404).send({ message: "NOT FOUND" });
  } else {
    const username = body.username;
    const department = body.department;
    if (username) user.username = username;
    if (department) user.department = department;
    return response.status(200).send(users);
  }

  response.status(200).send({ message: "PUT REQUEST" });
});

app.get("/api/products", (request, response) => {
  response.send([
    { id: 110, name: "CPU", price: 100 },
    { id: 112, name: "mouse", price: 25 },
  ]);
});
