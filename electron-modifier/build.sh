#!/bin/bash

cd "$(dirname "$0")"

entryFile="main.m"
dylibTitle="electron-modifier.dylib"
appDirectory=(../release/*-x64/*.app/Contents/Frameworks/Electron\ Wrapper\ Helper.app)

clang -framework AppKit -framework Foundation -compatibility_version 9999 -o $dylibTitle -dynamiclib "$entryFile" ZKSwizzle.m
mkdir -p "$appDirectory/Contents/Frameworks/"
cp ./"$dylibTitle" "$appDirectory/Contents/Frameworks/"
cd "$appDirectory/Contents/MacOS/"
insert_dylib --inplace "@executable_path/../Frameworks/$dylibTitle" ./* 