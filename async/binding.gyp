{
  "targets": [
    {
      "target_name": "index",
      "sources": [ "index.cc", "other.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}