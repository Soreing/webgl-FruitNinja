function Matrix4()
{
	this.m = [	1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1 ];
		
	this.Set = function(m)
	{	var m = this.m;
	
		m[0]  = m[0];    m[1]  = m[1];    m[2]  = m[2];    m[3]  = m[3];
		m[4]  = m[4];    m[5]  = m[5];    m[6]  = m[6];    m[7]  = m[7];
		m[8]  = m[8];    m[9]  = m[9];    m[10] = m[10];   m[11] = m[11];
		m[12] = m[12];   m[13] = m[13];   m[14] = m[14];   m[15] = m[15];
	}
		
	this.Translate = function(x, y, z)
	{	var m = this.m;	
	
		m[12] += m[0] *x + m[4] *y + m[8] *z;
		m[13] += m[1] *x + m[5] *y + m[9] *z;
		m[14] += m[2] *x + m[6] *y + m[10]*z;
		m[15] += m[3] *x + m[7] *y + m[11]*z;
	};
		
	this.Scale = function(x, y, z)
	{	var m = this.m;
	
		m[0] *= x;   m[1] *= x;   m[2]  *= x;   m[3]  *= x;
		m[4] *= y;   m[5] *= y;   m[6]  *= y;   m[7]  *= y;
		m[8] *= z;   m[9] *= z;   m[10] *= z;   m[11] *= z;
	};
		
	this.RotateX = function(r)
	{	var m = this.m;
		var t = [m[4], m[5], m[6], m[7]];
		
		s = Math.sin(r);
		c = Math.cos(r);
		
		m[4] = m[4]*c  + m[8]*s;   m[5] = m[5]*c  + m[9]*s;   m[6]  = m[6]*c  + m[10]*s;  m[7]  = m[7]*c  + m[11]*s;
		m[8] = t[0]*-s + m[8]*c;   m[9] = t[1]*-s + m[9]*c;   m[10] = t[2]*-s + m[10]*c;  m[11] = t[3]*-s + m[11]*c;
	};
		
	this.RotateY = function(r)
	{	var m = this.m;
		var t = [m[0], m[1], m[2], m[3]];
		
		s = Math.sin(r);
		c = Math.cos(r);
		
		m[0] = m[0]*c + m[8]*-s;   m[1] = m[1]*c + m[9]*-s;   m[2]  = m[2]*c + m[10]*-s;  m[3]  = m[3]*c + m[11]*-s;
		m[8] = t[0]*s + m[8]*c;    m[9] = t[1]*s + m[9]*c;    m[10] = t[2]*s + m[10]*c;   m[11] = t[3]*s + m[11]*c;
	};
		
	this.RotateZ = function(r)
	{	var m = this.m;
		var t = [m[0], m[1], m[2], m[3]];
		
		s = Math.sin(r);
		c = Math.cos(r);
		
		m[0] = m[0]*c  + m[4]*s;   m[1] = m[1]*c  + m[5]*s;   m[2] = m[2]*c  + m[6]*s;   m[3] = m[3]*c  + m[7]*s;
		m[4] = t[0]*-s + m[4]*c;   m[5] = t[1]*-s + m[5]*c;   m[6] = t[2]*-s + m[6]*c;   m[7] = t[3]*-s + m[7]*c;
	};
	
	this.Multiply = function(v)
	{	var m = this.m;
		
		return new Vector3(	v.x * m[0] + v.y * m[4] + v.z * m[8]  +  m[12],
							v.x * m[1] + v.y * m[5] + v.z * m[9]  +  m[13],
							v.x * m[2] + v.y * m[6] + v.z * m[10] +  m[14] );
	}
	
	this.Combine = function(bm)
	{	var a = this.m;
		var b = bm.m;
		
		var res = new Matrix4();
		
		res.m[0]  = a[0] * b[0 ] + a[4] * b[1 ] + a[8 ] * b[2 ] + a[12] * b[3 ];
		res.m[1]  = a[1] * b[0 ] + a[5] * b[1 ] + a[9 ] * b[2 ] + a[13] * b[3 ];
		res.m[2]  = a[2] * b[0 ] + a[6] * b[1 ] + a[10] * b[2 ] + a[14] * b[3 ];
		res.m[3]  = a[3] * b[0 ] + a[7] * b[1 ] + a[11] * b[2 ] + a[15] * b[3 ];
		res.m[4]  = a[0] * b[4 ] + a[4] * b[5 ] + a[8 ] * b[6 ] + a[12] * b[7 ];
		res.m[5]  = a[1] * b[4 ] + a[5] * b[5 ] + a[9 ] * b[6 ] + a[13] * b[7 ];
		res.m[6]  = a[2] * b[4 ] + a[6] * b[5 ] + a[10] * b[6 ] + a[14] * b[7 ];
		res.m[7]  = a[3] * b[4 ] + a[7] * b[5 ] + a[11] * b[6 ] + a[15] * b[7 ];
		res.m[8]  = a[0] * b[8 ] + a[4] * b[9 ] + a[8 ] * b[10] + a[12] * b[11];
		res.m[9]  = a[1] * b[8 ] + a[5] * b[9 ] + a[9 ] * b[10] + a[13] * b[11];
		res.m[10] = a[2] * b[8 ] + a[6] * b[9 ] + a[10] * b[10] + a[14] * b[11];
		res.m[11] = a[3] * b[8 ] + a[7] * b[9 ] + a[11] * b[10] + a[15] * b[11];
		res.m[12] = a[0] * b[12] + a[4] * b[13] + a[8 ] * b[14] + a[12] * b[15];
		res.m[13] = a[1] * b[12] + a[5] * b[13] + a[9 ] * b[14] + a[13] * b[15];
		res.m[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15];
		res.m[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15];
		
		return res;
	},
	
	this.CombineV4 = function(vs)
	{	var m = this.m;
		
		return [	vs[0] * m[0] + vs[1] * m[4] + vs[2] * m[8]  + vs[3] * m[12],
					vs[0] * m[1] + vs[1] * m[5] + vs[2] * m[9]  + vs[3] * m[13],
					vs[0] * m[2] + vs[1] * m[6] + vs[2] * m[10] + vs[3] * m[14],
					vs[0] * m[3] + vs[1] * m[7] + vs[2] * m[11] + vs[3] * m[15] ];
		
	},
	
	this.Duplicate = function()
	{
		var obj = new Matrix4()
		obj.m=this.m.slice();
		return obj;
	}
	
	this.Debug = function()
	{	var m = this.m;
		
		return	(m[0]<0?  "[ ": "[  ") + m[0].toFixed(3)  + (m[1]<0?  ", ":",  ") + m[1].toFixed(3)  + (m[2]<0?  ", ":",  ") + m[2].toFixed(3)  + (m[3]<0?  ", ":",  ") + m[3].toFixed(3)  + ", ]\n" +
				(m[4]<0?  "[ ": "[  ") + m[4].toFixed(3)  + (m[5]<0?  ", ":",  ") + m[5].toFixed(3)  + (m[6]<0?  ", ":",  ") + m[6].toFixed(3)  + (m[7]<0?  ", ":",  ") + m[7].toFixed(3)  + ", ]\n" +
				(m[8]<0?  "[ ": "[  ") + m[8].toFixed(3)  + (m[9]<0?  ", ":",  ") + m[9].toFixed(3)  + (m[10]<0? ", ":",  ") + m[10].toFixed(3) + (m[11]<0? ", ":",  ") + m[11].toFixed(3) + ", ]\n" +
				(m[12]<0? "[ ": "[  ") + m[12].toFixed(3) + (m[13]<0? ", ":",  ") + m[13].toFixed(3) + (m[14]<0? ", ":",  ") + m[14].toFixed(3) + (m[15]<0? ", ":",  ") + m[15].toFixed(3) + "  ]"   ;
	};
}

Matrix4.Perspective= function(fovy, aspect, near, far)
{
	
	var f = 1.0 / Math.tan( MathPlus.Radian(fovy)/2 );
	var d = far - near;

	var res = new Matrix4();	
	res.m[0] = f / aspect;
	res.m[5] = f;
	res.m[10] = -(near + far) / d;
	res.m[14] = -2 * near * far / d;
	res.m[11] = -1;
	res.m[15] = 0.0;
	
	return res;
};
	
Matrix4.Orthographic= function(left, right, bottom, top, near, far)
{
	var w = right - left;
	var h = top - bottom;
	var d = far - near;

	var res = new Matrix4();
	res.m[0] = 2.0 / w;
	res.m[5] = 2.0 / h;
	res.m[10] = -2.0 / d;
	res.m[12] = -(left + right) / w;
	res.m[13] = -(top + bottom) / h;
	res.m[14] = -(near + far) / d;

	return res;
};