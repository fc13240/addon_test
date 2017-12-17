#include <nan.h>

using namespace std;
using namespace Nan;
using namespace v8;

typedef unsigned char BYTE;

// const short MAX_SHORT = 32767;
// const short MIN_SHORT = (–32768);

const BYTE TYPE_INT = 0;
const BYTE TYPE_INT16 = 1;
const BYTE TYPE_FLOAT = 2;
const BYTE TYPE_DOUBLE = 3;
const BYTE TYPE_STRING = 4;
const BYTE TYPE_LONG = 5;
const BYTE TYPE_BYTE = 6;
const BYTE TYPE_BOOL = 7;
const BYTE TYPE_OBJECT = 100;
const BYTE TYPE_ARRAY = 101;
const BYTE TYPE_ARRAY_BOJECT = 102;
const BYTE TYPE_BUFFER = 103;

const int INIT_SIZE = 10124;
Local<Value> GetValue(Local<Object> obj, const char* key) {
  return Nan::Get(obj, Nan::New<String>(key).ToLocalChecked()).ToLocalChecked();
}
const char* ToStr(Local<Value> valStr) {
  // Nan::Utf8String nan_string(valStr);
  // std::string val_str(*nan_string);
  // return val_str.c_str();
  String::Utf8Value value(valStr);
  return *value ? *value : "<string conversion failed>";
}

void ThrowError(Isolate* isolate, const char* msg) {
  isolate->ThrowException(Exception::TypeError(
    String::NewFromUtf8(isolate, msg)));
}
void WriteInt(char* bf, int val, int* offset) {
  printf("%d %d %d %d\n", strlen(bf), *offset + 4, sizeof(bf), sizeof(*bf));
  // int size = strlen(bf);
  // if (size < *offset + 4) {
  //   char* bfNew = (char *)malloc(size + INIT_SIZE);
  //   strcpy(bfNew, bf);
  //   bf = bfNew;
  // }
  bf[*offset] = val & 0xff;
  bf[*offset+1] = (val>>8)  & 0xff;
  bf[*offset+2] = (val>>16) & 0xff;
  bf[*offset+3] = (val>>24) & 0xff;

  printf("writeInt1\n");
  *offset += 4;
  printf("writeInt\n");
}
void WriteInt16(char* bf, int val, int* offset) {
  
  bf[*offset] = val & 0xff;
  bf[*offset+1] = (val>>8)  & 0xff;

  printf("WriteInt161\n");
  *offset += 2;
  printf("WriteInt16\n");
}
void WriteLong(char* bf, long long val, int* offset) {
  printf("long val = %lld\n", val);
  bf[*offset] = val & 0xff;
  bf[*offset+1] = (val>>8)  & 0xff;
  bf[*offset+2] = (val>>16) & 0xff;
  bf[*offset+3] = (val>>24) & 0xff;
  bf[*offset+4] = (val>>32) & 0xff;
  bf[*offset+5] = (val>>40)  & 0xff;
  bf[*offset+6] = (val>>48) & 0xff;
  bf[*offset+7] = (val>>56) & 0xff;
  *offset += 8;

  //LE
  // int end = *offset + 8;
  // int start = *offset;
  // while(start < end) {
  //   bf[start++] = val & 255;
  //   val /= 256;
  // }
  // *offset += 8;

}
void WriteByte(char* bf, int val, int* offset) {
  bf[*offset] = val & 0xff;
  *offset += 1;
}
void WriteFloat(char* bf, float valFloat, int* offset) {
  unsigned int* val = (unsigned int*)(&valFloat); 
  bf[*offset] = *val & 0xff;
  bf[*offset+1] = (*val>>8)  & 0xff;
  bf[*offset+2] = (*val>>16) & 0xff;
  bf[*offset+3] = (*val>>24) & 0xff;

  *offset += 4;
}
void WriteDouble(char* bf, double valDouble, int* offset) {
  printf("double val = %lf\n", valDouble);
  unsigned long long* val = (unsigned long long*)(&valDouble); 

  // bf[*offset] = *val & 0xff;
  // bf[*offset+1] = (*val>>8)  & 0xff;
  // bf[*offset+2] = (*val>>16) & 0xff;
  // bf[*offset+3] = (*val>>24) & 0xff;
  // bf[*offset+4] = (*val>>32) & 0xff;
  // bf[*offset+5] = (*val>>40)  & 0xff;
  // bf[*offset+6] = (*val>>48) & 0xff;
  // bf[*offset+7] = (*val>>56) & 0xff;
  // *offset += 8;

  //LE
  int end = *offset + 8;
  int start = *offset;
  while(start < end) {
    bf[start++] = *val & 255;
    *val /= 256;
  }
  *offset += 8;

}
void WriteString(char* bf, char* valStr, int* offset) {
  printf("str = %s\n", valStr);
  int len = strlen(valStr);
  WriteInt(bf, len, offset);
  for (int i = 0; i < len; i++) {
    bf[*offset+i] = valStr[i];
  }
  *offset += len;
}

void Write(char* bfResult, int* indexWrited, Local<Value> data, BYTE type, Local<Value> prop) {
  switch(type) {
    case TYPE_BYTE:
      if (data->IsInt32()) {
        long val_byte = data->NumberValue();
        if (val_byte < -128 || val_byte > 127) {
          // ThrowError(isolate, "not byte");
        } else {
          WriteByte(bfResult, val_byte, indexWrited);
        }
      } else {
        // ThrowError(isolate, "not byte");
      }
      break;
    case TYPE_BOOL:
      WriteByte(bfResult, data->BooleanValue()?1: 0, indexWrited);
      break;
    case TYPE_INT16:
      if (data->IsInt32()) {
        int int16_val = data->Int32Value();
        if (int16_val >= -32768 && int16_val <= 32767) {
          WriteInt16(bfResult, int16_val, indexWrited);
        } else {
          // ThrowError(isolate, "not int16");
        }
      } else {
        // ThrowError(isolate, "not int16");
      }
      break;
    case TYPE_INT:
      if (data->IsInt32()) {
        WriteInt(bfResult, data->Int32Value(), indexWrited);
        printf("int indexWrited = %d\n", indexWrited);
      } else {
        // ThrowError(isolate, "not int32");
      }
      break;
    case TYPE_FLOAT:
      if (data->IsNumber()) {
        WriteFloat(bfResult, data->NumberValue(), indexWrited);
      }
      break;
    case TYPE_DOUBLE:
      if (data->IsNumber()) {
        WriteDouble(bfResult, data->NumberValue(), indexWrited);
      }
      break;
    case TYPE_LONG:
      if (data->IsNumber()) {
        WriteLong(bfResult, data->IntegerValue(), indexWrited);
      }
      break;
    case TYPE_STRING:
      if (data->IsString()) {
        WriteString(bfResult, (char*)ToStr(data), indexWrited);
      }
      break;
    case TYPE_OBJECT:
      Local<Array> propArr = Local<Array>::Cast(prop);
      for (unsigned int i = 0; i<propArr->Length(); i++) {
          Local<Object> propVal = propArr->Get(i)->ToObject();
          Local<Value> propOfProp = GetValue(propVal, "prop");
          BYTE typeOfProp = GetValue(propVal, "type")->NumberValue();
          const char* name = ToStr(GetValue(propVal, "name"));
          printf("name = %s, type = %d\n", name, typeOfProp);
          Local<Value> valOfData = GetValue(data->ToObject(), name);
          Write(bfResult, indexWrited, valOfData, typeOfProp, propOfProp);
      }
      break;
  }
}
void Create(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  Isolate* isolate = info.GetIsolate();
  if (info.Length() == 2) {
    Local<Object> conf = info[0]->ToObject();
    BYTE type = GetValue(conf, "type")->NumberValue();
    Local<Value> prop = GetValue(conf, "prop");
    char* bfResult = (char *)malloc(INIT_SIZE);
    int indexWrited = 0;
    printf("type = %d, val = %lld\n", type, info[1]->NumberValue());
    
    Write(bfResult, &indexWrited, info[1], type, prop);
    // info.GetReturnValue().Set(Nan::New<Boolean>(type));
    info.GetReturnValue().Set(Nan::NewBuffer(bfResult, indexWrited).ToLocalChecked());
    
    // long long value = info[1]->IntegerValue();
    // Local<Number> retval = Number::New(isolate, value);
    // info.GetReturnValue().Set(retval);
  } else {
    ThrowError(isolate, "param error");
  }
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("create").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Create)->GetFunction());
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)