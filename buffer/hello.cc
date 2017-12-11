#include <nan.h>
#include <iostream>
#include <fstream>
#include <direct.h>  

using namespace std;
using namespace Nan;
using namespace v8;

char* ToCString(Local<String> str) {
  String::Utf8Value value(str);
  return *value ? *value : "<string conversion failed>";
}
// char* ReadFile1(char* filepath) {
//   ifstream input(filepath);
  
//   char data;
//   while(!input.eof()) {
//     input.get(data);
//     cout<<data;
//   }
//   cout<<endl;
//   return filepath;
// }
char* ReadFile(const char* filepath) {
  FILE *f = fopen(filepath, "rb");
  fseek(f, 0, SEEK_END);
  long fsize = ftell(f);
  fseek(f, 0, SEEK_SET);
  
  char* string = (char *)malloc(fsize + 1);
  fread(string, fsize, 1, f);
  fclose(f);
  
  string[fsize] = 0;
  return string;
}
void Method(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  Local<Value> argv = info[0]->ToObject();
  // 得到nodejs传过来的buffer
  char *buf = node::Buffer::Data(argv);
  // 得到buffer的长度
  size_t size = node::Buffer::Length(argv);

  // 返回传入的buffer的长度
  Local<Number> retval = Nan::New<Number>(size);
  info.GetReturnValue().Set(retval);
}
void Encode(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  Local<Value> argv = info[0];
  char* bufferOfFile;
  size_t size = 0;
  const char* keypath = getcwd(NULL, 0);
  printf("keypath = %s", keypath);
  if (argv->IsString()) {
    Nan::Utf8String nan_string(info[0]);
    std::string name(*nan_string);
    const char* filepath = name.c_str();
    bufferOfFile = ReadFile(filepath);
    printf("bf in c++1", bufferOfFile);
    size = strlen(bufferOfFile);
  } else {
    bufferOfFile = node::Buffer::Data(argv);
    printf("bf in c++:", bufferOfFile);
    size = node::Buffer::Length(argv);
    bufferOfFile[2] = 3;
  }

  info.GetReturnValue().Set(Nan::NewBuffer(bufferOfFile, size).ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
  
  exports->Set(Nan::New("encode").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Encode)->GetFunction());
}

NODE_MODULE(hello, Init)