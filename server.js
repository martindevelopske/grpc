const grpc = require("@grpc/grpc-js");

const protoLoader = require("@grpc/proto-loader");

//read the proto file
const packageDef = protoLoader.loadSync("todo.proto", {keepCase: true, longs:String, enums: String, defaults: true, oneofs:  true});


//convert the loaded package into a usable gRPC object
const todoProto= grpc.loadPackageDefinition(packageDef);

const todoPackageObject = todoProto.todoPackage;

function getServer(){
 const server = new grpc.Server();
server.addService(todoPackageObject.TodoService.service, {createTodo: createTodo, readTodos: readTodos});
return server;
}

const todosServer=getServer();

todosServer.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), (err, port)=>{
  if(err !=null){
    return console.error(err);
  }
  console.log(`gRPC listening on port ${port}`);
  
});
function createTodo (call, callback){
console.log(call)
}

  
function readTodos(call, callback){
console.log(call)
} 
