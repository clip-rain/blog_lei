var mongodb=require('./db');
var markdown=require('markdown').markdown;

function Post(name,title,post){
	this.name=name;
	this.title=title;
	this.post=post;
}

module.exports=Post;

//�洢һƬ���¼��������Ϣ
Post.prototype.save=function(callback){
	var date=new Date();
	//�洢����ʱ���ʽ�������Ժ���չ
	var time ={
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
			+" "+date.getHours()+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes())
	}
	var post={
		name:this.name,
		time:time,
		title:this.title,
		post:this.post
	};
	//�����ݿ�
	mongodb.open(function (err,db){
		if(err){
			return callback(err);
		}
		//��ȡpost����
		db.collection('posts',function (err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//���ĵ�����posts����
			collection.insert(post,{safe:true},function (err){
				mongodb.close();
				if(err){
					return callback(err);//ʧ�ܣ�����err
				}
				callback(null);
			});
		});
	});
}	

	//��ȡ���¼��������Ϣ
Post.get=function(name,callback){
		//�����ݿ�
		mongodb.open(function (err,db){
			if(err){
				mongodb.close();
				return callback(err);
			}
			db.collection('posts',function (err,collection){
				if(err){
					mongodb.close();
					return callback(err);
				}
				var query={};
				if(name){
					query.name=name;
				}
				//����query�����ѯ����
				collection.find(query).sort({
					time:-1
				}).toArray(function (err,docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					docs.forEach(function (doc){
						doc.post=markdown.toHTML(doc.post);
					});
					callback(null,docs);
				});
			});
		});					
}

		