#include <nan.h>
#include "HTTPDownloader.hpp"
#include <iostream>
#include <string>
using namespace std;
using namespace Nan;
using namespace v8;
const char* ToStr(Local<Value> valStr) {
  // Nan::Utf8String nan_string(valStr);
  // std::string val_str(*nan_string);
  // return val_str.c_str();
  Nan::Utf8String nan_string(valStr);
  std::string name(*nan_string);
  const char* filepath = name.c_str();
  printf("s1 = %s, len = %d\n", filepath, strlen(filepath));
  return filepath;

  // String::Utf8Value value(valStr);
  // return *value ? *value : "<string conversion failed>";
}
void Method(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  HTTPDownloader downloader;
  std::string content = downloader.download("http://tonny-zhang.github.io/info.php");
  printf("%s\n", content);
  info.GetReturnValue().Set(Nan::New("world").ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(hello, Init)