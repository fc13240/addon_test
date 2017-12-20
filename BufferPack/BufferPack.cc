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
const long long BIT32 = 4294967296;
const long long BIT24 = 16777216;

const int INIT_SIZE = 10124;
Local<Value> GetValue(Local<Object> obj, const char* key) {
  return Nan::Get(obj, Nan::New<String>(key).ToLocalChecked()).ToLocalChecked();
}
const char* ToStr(Local<Value> valStr) {
  // Nan::Utf8String nan_string(valStr);
  // std::string val_str(*nan_string);
  // return val_str.c_str();
  Nan::Utf8String nan_string(valStr);
  std::string name(*nan_string);
  const char* filepath = name.c_str();
  // printf("s1 = %s\n", filepath);
  return filepath;

  // String::Utf8Value value(valStr);
  // return *value ? *value : "<string conversion failed>";
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
void WriteString(char* bf, int* offset, const char* valStr) {
  int len = strlen(valStr);
  // printf("str = %s, len = %d\n", valStr, len);
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
        Nan::Utf8String nan_string(data);
        std::string name(*nan_string);
        const char* val_str = name.c_str();

        // const char* val_str = ToStr(data);
        // printf("s2 = %s, s3 = %s\n", val_str, filepath);
        // WriteString(bfResult, indexWrited, );
        WriteString(bfResult, indexWrited, val_str);
      }
      break;
    case TYPE_OBJECT:
      if (prop->IsArray()) {
        Local<Array> propArr = Local<Array>::Cast(prop);
        for (unsigned int i = 0; i<propArr->Length(); i++) {
            Local<Object> propVal = propArr->Get(i)->ToObject();
            Local<Value> propOfProp = GetValue(propVal, "prop");
            BYTE typeOfProp = GetValue(propVal, "type")->NumberValue();
            Local<Value> nameOfProp = GetValue(propVal, "name");
            Nan::Utf8String nan_string(nameOfProp);
            std::string nameStr(*nan_string);
            const char* name = nameStr.c_str();
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
              Local<Value> nameOfP = GetValue(p, "name");
              Nan::Utf8String nan_string(nameOfP);
              std::string nameStr(*nan_string);
              const char* name = nameStr.c_str();
              Local<Value> v = GetValue(val, name);
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

int ReadInt(char* bf, int* indexReaded) {
  int result = (bf[*indexReaded] & 0xff)
            + ((bf[*indexReaded + 1]<<8) & 0xffff)
            + ((bf[*indexReaded + 2]<<16) & 0xffffff)
            + ((bf[*indexReaded + 3]<<24) & 0xffffffff);
  *indexReaded += 4;
  return result;
}
long long ReadLong(char* bf, int* indexReaded) {
  int high = (bf[*indexReaded + 4] & 0xff)
    + ((bf[*indexReaded + 5]<<8) & 0xffff)
    + ((bf[*indexReaded + 6]<<16) & 0xffffff)
    + ((bf[*indexReaded + 7]<<24) & 0xffffffff);
  int low = (bf[*indexReaded] & 0xff)
    + ((bf[*indexReaded + 1]<<8) & 0xffff)
    + ((bf[*indexReaded + 2]<<16) & 0xffffff)
    + ((bf[*indexReaded + 3]<<24) & 0xffffffff);
  
  long long val_long = high * BIT32 + low;
  *indexReaded += 4;
  return val_long;
}
Local<Value> Read(char* bf, int* indexReaded, BYTE type, Local<Value> prop) {
  Local<Value> result;
  switch(type) {
    case TYPE_BOOL:
      result = Nan::New(bf[*indexReaded] == 1);
      *indexReaded += 1;
      break;
    case TYPE_BYTE:
      result = Nan::New(bf[*indexReaded]);
      *indexReaded += 1;
      break;
    case TYPE_INT16:
      result = Nan::New(bf[*indexReaded] + (bf[*indexReaded + 1]<<8));
      *indexReaded += 2;
      break;
    case TYPE_INT:
      result = Nan::New(ReadInt(bf, indexReaded));
      break;
    case TYPE_LONG:
      {
        double val_long = ReadLong(bf, indexReaded);
        result = Nan::New(val_long);
      }
      break;
    case TYPE_FLOAT:
      {
        int val_int = ReadInt(bf, indexReaded);
        float* f = (float*)(&val_int);
        result = Nan::New(*f);
      }
      break;
    case TYPE_DOUBLE:
      {
        long long val_long = ReadLong(bf, indexReaded);
        double* p_double = (double*)(&val_long);
        result = Nan::New(*p_double);
        *indexReaded += 8;
      }
      break;
  }
  return result;
}
void Parse(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  Isolate* isolate = info.GetIsolate();
  if (info.Length() == 2) {
    Local<Object> conf = info[0]->ToObject();
    BYTE type = GetValue(conf, "type")->NumberValue();
    Local<Value> prop = GetValue(conf, "prop");
    int indexReaded = 0;
    char* bf = node::Buffer::Data(info[1]);
    Local<Value> result = Read(bf, &indexReaded, type, prop);

    info.GetReturnValue().Set(result);
  } else {
    ThrowError(isolate, "param error");
  }
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("create").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Create)->GetFunction());
  exports->Set(Nan::New("parse").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Parse)->GetFunction());               
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)