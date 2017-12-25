#include <nan.h>
#include <stdio.h>
#include <stdlib.h>

#include <iostream>
#include <cstdlib>
#include <cstdio>
using namespace std;
using namespace Nan;
using namespace v8;

void Method(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  FILE *fp; 
  char buffer[1024*30];
  #ifdef _WIN32
    fp = _popen("curl http://tonny-zhang.github.io/info.php", "r");
  #else
    fp = popen("curl http://tonny-zhang.github.io/info.php", "r");
  #endif
  // fp = popen("curl http://www.baidu.com", "r");
  while(fgets(buffer, sizeof(buffer), fp)) {
    printf("%s", buffer);
  }
  
  #ifdef _WIN32
    _pclose(fp);
  #else
    pclose(fp);
  #endif
  
  info.GetReturnValue().Set(Nan::New("world").ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(hello, Init)