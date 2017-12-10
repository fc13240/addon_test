#include <nan.h>

using namespace std;
using namespace Nan;
using namespace v8;
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

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(hello, Init)