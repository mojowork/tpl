# tpl
基于字符串的模版引擎
## 用法

```
let tpl = `
    <div>
        小明是个老师，他的名字叫做{{name}}， 今年{{year}}岁。
        他有学生{{student.length}}个。
        {{#student}}
            <span>学生 ==> {{name}}</span>
                <span>{{#girls}}</span>
                    <span>年龄： {{age}}</span>
                <span>{{/girls}}</span>
        {{/student}}
    </div>
`
let data = {
    name: 'chaos',
    year: 28,
    student: [
        {   name: 'student1',
            girls: [
                    {
                        age: '36d'
                    },
                    {
                        age: '36d'
                    },
                ]
        },
        {   
            name: 'student2',
            girls: [
                {
                    age: '36d'
                },
                {
                    age: '36d'
                },
            ]
        }
    ]
}

new Tpl(tpl, data)
.render('#app')

小明是个老师，他的名字叫做chaos， 今年28岁。 他有学生2个。 学生 ==> student1 年龄： 36d 年龄： 36d 学生 ==> student2 年龄： 36d 年龄：36d

```
