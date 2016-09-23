#!/bin/bash
function hello {
	local salary=45000
	echo $salary
	let "monthly=45000/12"
	echo "monthly = $monthly"
}