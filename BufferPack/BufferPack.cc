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
void WriteInt(char* bf, int* offset, int val) {
  // printf("%d %d %d %d\n", strlen(bf), *offset + 4, sizeof(bf), sizeof(*bf));
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

  *offset += 4;
}
void WriteInt16(char* bf, int* offset, int val) {
  
  bf[*offset] = val & 0xff;
  bf[*offset+1] = (val>>8)  & 0xff;

  *offset += 2;
}
void WriteLong(char* bf, int* offset, long long val) {
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
void WriteByte(char* bf, int* offset, int val) {
  bf[*offset] = val & 0xff;
  *offset += 1;
}
void WriteFloat(char* bf, int* offset, float valFloat) {
  unsigned int* val = (unsigned int*)(&valFloat); 
  bf[*offset] = *val & 0xff;
  bf[*offset+1] = (*val>>8)  & 0xff;
  bf[*offset+2] = (*val>>16) & 0xff;
  bf[*offset+3] = (*val>>24) & 0xff;

  *offset += 4;
}
void WriteDouble(char* bf, int* offset, double valDouble) {
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
void WriteString(char* bf, int* offset, char* valStr) {
  int len = strlen(valStr);
  WriteInt(bf, offset, len);
  for (int i = 0; i < len; i++) {
    bf[*offset+i] = valStr[i];
  }
  *offset += len;
}
void WriteBuffer(char* bf, int* offset, char* bfWrite, long size) {
  WriteInt16(bf, offset, size);
  for (unsigned int i = 0; i<size; i++) {
    bf[*offset+i] = bfWrite[i];
  }
  *offset += size;
}

void Write(char* bfResult, int* indexWrited, Local<Value> data, BYTE type, Local<Value> prop) {
  switch(type) {
    case TYPE_BYTE:
      if (data->IsInt32()) {
        long val_byte = data->NumberValue();
        if (val_byte < -128 || val_byte > 127) {
          // ThrowError(isolate, "not byte");
        } else {
          WriteByte(bfResult, indexWrited, val_byte);
        }
      } else {
        // ThrowError(isolate, "not byte");
      }
      break;
    case TYPE_BOOL:
      WriteByte(bfResult, indexWrited, data->BooleanValue()?1: 0);
      break;
    case TYPE_INT16:
      if (data->IsInt32()) {
        int int16_val = data->Int32Value();
        if (int16_val >= -32768 && int16_val <= 32767) {
          WriteInt16(bfResult, indexWrited, int16_val);
        } else {
          // ThrowError(isolate, "not int16");
        }
      } else {
        // ThrowError(isolate, "not int16");
      }
      break;
    case TYPE_INT:
      if (data->IsInt32()) {
        WriteInt(bfResult, indexWrited, data->Int32Value());
      } else {
        // ThrowError(isolate, "not int32");
      }
      break;
    case TYPE_FLOAT:
      if (data->IsNumber()) {
        WriteFloat(bfResult, indexWrited, data->NumberValue());
      }
      break;
    case TYPE_DOUBLE:
      if (data->IsNumber()) {
        WriteDouble(bfResult, indexWrited, data->NumberValue());
      }
      break;
    case TYPE_LONG:
      if (data->IsNumber()) {
        WriteLong(bfResult, indexWrited, data->IntegerValue());
      }
      break;
    case TYPE_STRING:
      if (data->IsString()) {
        WriteString(bfResult, indexWrited, (char*)ToStr(data));
      }
      break;
    case TYPE_OBJECT:
      if (prop->IsArray()) {
        Local<Array> propArr = Local<Array>::Cast(prop);
        for (unsigned int i = 0; i<propArr->Length(); i++) {
            Local<Object> propVal = propArr->Get(i)->ToObject();
            Local<Value> propOfProp = GetValue(propVal, "prop");
            BYTE typeOfProp = GetValue(propVal, "type")->NumberValue();
            const char* name = ToStr(GetValue(propVal, "name"));
            // printf("name = %s, type = %d\n", name, typeOfProp);
            Local<Value> valOfData = GetValue(data->ToObject(), name);
            Write(bfResult, indexWrited, valOfData, typeOfProp, propOfProp);
        }
      }
      break;
    case TYPE_ARRAY:
      if (data->IsArray()) {
        Local<Array> dataArr = Local<Array>::Cast(data);
        int lenDataArr = dataArr->Length();
        WriteInt16(bfResult, indexWrited, lenDataArr);

        BYTE typeOfData = GetValue(prop->ToObject(), "type")->NumberValue();
        for (unsigned int i = 0; i<lenDataArr; i++) {
          Write(bfResult, indexWrited, dataArr->Get(i), typeOfData, prop);
        }
      }
      break;
    case TYPE_ARRAY_BOJECT:
      if (data->IsArray()) {
        Local<Array> dataArr = Local<Array>::Cast(data);
        int lenDataArr = dataArr->Length();
        WriteInt16(bfResult, indexWrited, lenDataArr);

        Local<Array> propArr = Local<Array>::Cast(prop);
        int lenPropArr = propArr->Length();
        for (unsigned int i = 0; i<lenDataArr; i++) {
          Local<Object> val = dataArr->Get(i)->ToObject();
          if (val->IsObject()) {
            for (unsigned int iProp = 0; iProp<lenPropArr; iProp++) {
              Local<Object> p = propArr->Get(iProp)->ToObject();
              BYTE t = GetValue(p, "type")->NumberValue();
              Local<Value> v = GetValue(val, ToStr(GetValue(p, "name")));
              Local<Value> pp = GetValue(p, "prop");
              Write(bfResult, indexWrited, v, t, pp);
            }
          }
        }
      }
      break;
    case TYPE_BUFFER:
      if (data->IsUint8Array()) {
        char* bf = node::Buffer::Data(data);
        long sizeOfBf = node::Buffer::Length(data);
        WriteBuffer(bfResult, indexWrited, bf, sizeOfBf);
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
    // printf("type = %d, val = %lld\n", type, info[1]->NumberValue());
    
    Write(bfResult, &indexWrited, info[1], type, prop);
    // info.GetReturnValue().Set(Nan::New<Boolean>(type));
    info.GetReturnValue().Set(Nan::NewBuffer(bfResult, indexWrited).ToLocalChecked());
  } else {
    ThrowError(isolate, "param error");
  }
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("create").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Create)->GetFunction());
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)