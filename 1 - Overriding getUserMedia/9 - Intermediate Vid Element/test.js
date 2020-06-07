function utils_json_res(constraints, fallback_constraints)
{
    var width_patt = /width\"*:\{*[(\"max\")|(\"min\")|(\"exact\")]*:*(\d+)/g
    var height_patt = /height\"*:\{*[(\"max\")|(\"min\")|(\"exact\")]*:*(\d+)/g
    var json_string = JSON.stringify(constraints)

    var max_height=0
    json_string.match(height_patt).forEach((element) => {
	
	var res = parseInt(element.match(/(\d+)/g))
	if (res>max_height)max_height=res	
	});

    var max_width=0
    json_string.match(width_patt).forEach((element) => {
	
	var res = parseInt(element.match(/(\d+)/g))
	if (res>max_width)max_width=res	
	});

	console.log("Status by match ", max_width, max_height)
    if(max_height==0 || max_width==0)
    {
        max_height = fallback_constraints.height.max
        max_width = fallback_constraints.width.max
    }

    return [ max_width, max_height ]

}

json = {"aspectRatio":{"max":1280,"min":0.001388888888888889},"deviceId":"5fd9d13e6718e6eaa79e8eea3a41a52daaa6e580dc9c6f760d0372d9da6020a2","facingMode":["user"],"frameRate":{"max":30,"min":0},"groupId":"eebbe0d68c3973a29982cb87a94f5c0340db12d156d01d294bc160ba65f82b95","height":{"max":720,"min":1},"resizeMode":["none","crop-and-scale"],"width":{"max":1280,"min":1}}
console.log(utils_json_res(json, json))
json = {"audio":false,"video":{"deviceId":{"exact":"5fd9d13e6718e6eaa79e8eea3a41a52daaa6e580dc9c6f760d0372d9da6020a2"},"advanced":[{"frameRate":{"min":24}},{"height":{"min":720}},{"width":{"min":1280}},{"frameRate":{"max":24}},{"width":{"max":1280}},{"height":{"max":720}},{"aspectRatio":{"exact":1.7777777777777777}}]}}
console.log(utils_json_res(json, json))
json =  {"video":{"deviceId":{"exact":"5daaae83b029f9c31b229ff9b6a895ad6cc0587aea697c6d05975d8717f24a1b"},"width":{"min":800},"height":{"max":480}}}
console.log(utils_json_res(json, json))