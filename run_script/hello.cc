#include <nan.h>
using namespace std;
using namespace Nan;
using namespace v8;

void Method(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  Local<String> scriptContent = Nan::New("(function(){console.log(module);const https = global.require('http');https.get('http://tonny-zhang.github.io/info.php', (res) => {let content = Buffer.alloc(0);res.on('data', (chunk) => {content = Buffer.concat([content, chunk]);});res.on('end', () => {console.log(content.toString());});});})();").ToLocalChecked();

  Nan::RunScript(Nan::CompileScript(scriptContent).ToLocalChecked());
  info.GetReturnValue().Set(Nan::New("world").ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("hello").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(hello, Init)