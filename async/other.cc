#include <nan.h>
#include <stdio.h>
#include <time.h> 

using namespace Nan;  // NOLINT(build/namespaces)

#ifdef _WIN32
    #define popen(x, y) _popen(x, y);
    #define pclose(x) _pclose(x);
#endif
NAN_METHOD(RunShell) {
    FILE *fp; 
    char buffer[1024*30];
    fp = popen("curl http://tonny-zhang.github.io/info.php", "r");
    
    while(fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }
    pclose(fp);
    Sleep(1000*5);
}
NAN_METHOD(RunCurl) {
    //!!! 这里测试暂时会阻塞主线程！！
    FILE *fp; 
    char buffer[1024*30];
    fp = popen("curl http://tonny-zhang.github.io/info.php", "r");
    
    while(fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }
    pclose(fp);
    Sleep(5000);
}