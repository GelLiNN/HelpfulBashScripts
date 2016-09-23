#!/bin/bash
arg1=$1;
read -a arr <<<$arg1

sum=$( IFS="+"; bc <<< "${arr[*]}" )
echo $sum;
