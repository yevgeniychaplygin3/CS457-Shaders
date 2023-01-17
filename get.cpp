int
GetUniformVariableTypeAndSize( GLuint program, const GLchar *name, GLint *sizep, GLenum *typep )
{
	int numactiveUniforms;
	glGetProgramiv( program, GL_ACTIVE_UNIFORMS, &numactiveUniforms );
	if( Verbose )
		fprintf( stderr, "numactiveUniforms = %d\n", numactiveUniforms );

	int bufsize;
	glGetProgramiv( program, GL_ACTIVE_UNIFORM_MAX_LENGTH, &bufsize );
	char *lname = new char [bufsize+1];

	for( int i = 0; i < numactiveUniforms; i++ )
	{
		GLint lsize;
		GLenum ltype;
		glGetActiveUniform( program, i, bufsize, NULL, &lsize, &ltype, lname );
		if( strcmp( name, lname ) == 0 )
		{
			if( Verbose )
				fprintf( stderr, "Uniform Variable #%2d, '%s' is size %d and type 0x%X\n", i, lname, lsize, ltype );
			*sizep = lsize;
			*typep = ltype;
			return 0;
		}
	}

	return -1;
}



int
GetAttributeVariableTypeAndSize( GLuint program, const GLchar *name, GLint *sizep, GLenum *typep )
{
	int numactiveAttributes;
	glGetProgramiv( program, GL_ACTIVE_ATTRIBUTES, &numactiveAttributes );
	if( Verbose )
		fprintf( stderr, "numactiveAttributes = %d\n", numactiveAttributes );

	int bufsize;
	glGetProgramiv( program, GL_ACTIVE_UNIFORM_MAX_LENGTH, &bufsize );
	char *lname = new char [bufsize+1];

	for( int i = 0; i < numactiveAttributes; i++ )
	{
		GLint lsize;
		GLenum ltype;
		glGetActiveAttribute( program, i, bufsize, NULL, &lsize, &ltype, lname );
		if( strcmp( name, lname ) == 0 )
		{
			if( Verbose )
				fprintf( stderr, "Uniform Variable #%2d, '%s' is size %d and type 0x%X\n", i, lname, lsize, ltype );
			*sizep = lsize;
			*typep = ltype;
			return 0;
		}
	}

	return -1;
}
