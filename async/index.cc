/*********************************************************************
 * NAN - Native Abstractions for Node.js
 *
 * Copyright (c) 2017 NAN contributors
 *
 * MIT License <https://github.com/nodejs/nan/blob/master/LICENSE.md>
 ********************************************************************/
#include <time.h> 
#ifndef _WIN32
#define Sleep(x) usleep((x)*1000)
#endif
#include <nan.h>
#include "./other.cc"

using namespace Nan;  // NOLINT(build/namespaces)

class SleepWorker : public AsyncWorker {
 public:
  SleepWorker(Callback *callback, int milliseconds)
    : AsyncWorker(callback), milliseconds(milliseconds) {}
  ~SleepWorker() {}

  void Execute () {
    Sleep(milliseconds);
  }

 private:
  int milliseconds;
};
class CurlWorker : public AsyncWorker {
 public:
  CurlWorker(Callback *callback)
    : AsyncWorker(callback) {}
  ~CurlWorker() {}

  void Execute () {
    // RunCurl();
  }

 private:
  char* url;
};

int index = 0;
NAN_METHOD(RunInterval) {
  time_t t = time(0); 
  char tmp[64]; 
  strftime( tmp, sizeof(tmp), "%Y/%m/%d %X %A di [%j] tian %z",localtime(&t) ); 
  puts( tmp ); 
  printf("%d %s\n", index++, tmp);
  Callback *callbackInterval = new Callback(New<v8::FunctionTemplate>(RunInterval)->GetFunction());
  AsyncQueueWorker(
      new SleepWorker(callbackInterval, 1000));
}

NAN_METHOD(DoSleep) {
  Callback *callback = new Callback(To<v8::Function>(info[1]).ToLocalChecked());
  AsyncQueueWorker(
      new SleepWorker(callback, To<uint32_t>(info[0]).FromJust()));

  Callback *callbackInterval = new Callback(New<v8::FunctionTemplate>(RunShell)->GetFunction());
  AsyncQueueWorker(
      new SleepWorker(callbackInterval, 1000));
}

NAN_METHOD(DoSum) {
  Callback *callbackInterval = new Callback(New<v8::FunctionTemplate>(RunCurl)->GetFunction());
  AsyncQueueWorker(
      new CurlWorker(callbackInterval));
  
  info.GetReturnValue().Set(10);
}
NAN_MODULE_INIT(Init) {
  Set(target
    , New<v8::String>("a").ToLocalChecked()
    , New<v8::FunctionTemplate>(DoSleep)->GetFunction());
  Set(target
    , New<v8::String>("b").ToLocalChecked()
    , New<v8::FunctionTemplate>(DoSum)->GetFunction());
}

NODE_MODULE(asyncworker, Init)