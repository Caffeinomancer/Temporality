#version 330 core

// Varyings
in vertexData
{
	vec4 fragPos;
	vec4 normal;
	vec4 lightPos;
	vec4 eyePos;
	vec2 texCoords;
	mat4 modelMat;
} pass;

// uniforms
uniform sampler2D ambientTex;
uniform sampler2D diffuseTex;
uniform sampler2D specularTex;
uniform sampler2D bumpTex;

// target
layout (location = 0) out vec4 fragColor;

void main()
{
	vec4 lightColor = vec4(1.0, 1.0, 1.0, 1.0);
	float specAmount = 32.0f;
	//vec4 norm = normalize(pass.modelMat * (texture(bumpTex, pass.texCoords) * 2.0 - 1.0));
	vec4 norm = pass.modelMat * (texture(bumpTex, pass.texCoords) * 2.0 - 1.0);

	float amb = 0.1;
	vec4 ambient = texture(ambientTex, pass.texCoords) * amb * lightColor;

	vec4 lightDir = normalize(pass.lightPos - pass.fragPos);
	float diff = max(dot(pass.normal /*norm*/, lightDir), 0.0);
	vec4 diffuse = texture(diffuseTex, pass.texCoords) * diff * lightColor;

	vec4 viewDir = normalize(pass.eyePos - pass.fragPos);
	vec4 halfwayDir = normalize(lightDir + viewDir);
	float spec = pow(max(dot(pass.normal /*norm*/, halfwayDir), 0.0), specAmount);
	vec4 specular = /*texture(specularTex, pass.texCoords) * */ spec * lightColor;

	fragColor = vec4(ambient.xyz + diffuse.xyz + specular.xyz, 1.0f);
}