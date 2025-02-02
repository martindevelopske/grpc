const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Read the proto file
const packageDef = protoLoader.loadSync("todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Convert the loaded package into a usable gRPC object
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackageObject = grpcObject.todoPackage;

const client = new todoPackageObject.TodoService(
  "localhost:4000",
  grpc.credentials.createInsecure(),
);

async function main() {
  await client.createTodo({ id: -1, text: "Do Laundry" }, (err, response) => {
    if (err) {
      console.error("Error creating todo:", err);
      return;
    }

    console.log("Received from server:", JSON.stringify(response));
  });

  //read the todos
  //await client.readTodos({}, (err, response) => {
  //  console.log("reading todos....");
  //  if (err) {
  //    console.error("Error reading todos:", err);
  //    return;
  //  }
  //
  //  // Check if items exist
  //  if (response.items) {
  //    response.items.forEach((a) => console.log("Todo:", a.text));
  //  }
  //});
  //
  // Read streaming todos
  const call = client.readTodosStream();
  call.on("data", (item) => {
    console.log("Received items from server:", JSON.stringify(item));
  });

  call.on("end", () => console.log("Server done!"));
}
main();
