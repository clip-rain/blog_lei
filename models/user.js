var mongodb=require('./db');

function User(user){
this.name=user.name;
this.password=user.password;
this.email=user.email;
};

module.exports=User;

//�洢�û���Ϣ
User.prototype.save=function(callback){
	var user={
		name:this.name,
		password:this.password,
		email:this.email
		};
	//�����ݿ�
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//��ȡusers����
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//���û����ݲ���users����
			collection.insert(user,{safe:true},function(err,user){mongodb.close();if(err){return callback(err);}
				callback(null,user[0]);
				});
			});
	});

};

User.get=function(name,callback){
	//�����ݿ�
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//��ȡusers����
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//ʧ�ܣ�����err��Ϣ
			}
			//�����û�����name����ֵΪnameһ���ĵ�
			collection.findOne({name:name},function(err,user){mongodb.close();if(err){return callback(err);}
				callback(null,user);//�ɹ������ز�ѯ���û���Ϣ
				});
			});
	});

};
