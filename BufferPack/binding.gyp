{
  "targets": [
    {
      "target_name": "BufferPack",
      "sources": [ "BufferPack.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}