const grpc = require("@grpc/grpc-js");

const protoLoader = require("@grpc/proto-loader");

//read the proto file
const packageDef = protoLoader.loadSync("todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

//convert the loaded package into a usable gRPC object
const todoProto = grpc.loadPackageDefinition(packageDef);

const todoPackageObject = todoProto.todoPackage;
const todos = [];
function getServer() {
  const server = new grpc.Server();
  server.addService(todoPackageObject.TodoService.service, {
    createTodo: createTodo,
    readTodos: readTodos,
    readTodosStream: readTodosStream,
  });
  return server;
}

const todosServer = getServer();

todosServer.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on port ${port}`);
  },
);
function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  console.log("reading todos.........");
  console.log(todos);
  callback(null, { items: todos });
}

function readTodosStream(call, callback) {
  todos.forEach((item) => {
    call.write(item);
  });
  call.end();
}
