export default class Tpl{
    constructor(tpl='', data={}) {
        this.tpl = tpl
        this.data = data
        this.position = 0
        this.tokens = []
        this.scan(this.tpl)
        this.nest(this.tokens)
        this.domstr = this.mixin(this.tokens, this.data)
    }
    // 扫描字符串
    scan(str) {
        const regex = /\{\{(\S+)\}\}/g
        let array,lastIndex;
        while ((array = regex.exec(str)) !== null) {
            const name = array[1];
            const index = array.index;
            lastIndex = regex.lastIndex;
            let substring = str.substring(this.position, index)
            this.position = lastIndex
            this.tokens.push(['text', substring])
            this.tokens.push(['name', name])
        }
        this.tokens.push(['text', str.substring(lastIndex)])
    }
    // 折叠tokens
    nest(tokens) {
        const stack = [];
        this.tokens = tokens.reduce((acc, token) => {
            if(token[0] === 'name' && token[1].startsWith("#")){
                stack.push(['#', token[1].substr(1)])
            } else if (token[0] === 'name' && token[1].startsWith("/")) {
                if(stack.length > 1){
                    const tkns = stack.pop()
                    const lastIndex = stack.length - 1;
                    if(!stack[lastIndex][2]) {
                        stack[lastIndex][2] = []
                    }
                    stack[lastIndex][2].push(tkns)
                } else {
                    acc.push(stack.pop())
                }
            } else {
                if(stack.length){
                    const lastIndex = stack.length - 1;
                    if(!stack[lastIndex][2]) {
                        stack[lastIndex][2] = []
                    }
                    stack[lastIndex][2].push(token)
                } else {
                    acc.push(token)
                }
            }
            return acc
        }, [])
    }

    // 数据和模版的结合
    mixin(tokens, data) {
        return tokens.reduce((str, token) => {
            switch(token[0]) {
                case 'text':
                    str += token[1];
                   break;
                case 'name':
                    str += get(data, token[1]);
                   break;
                case '#':
                    let sub = get(data, token[1]);
                    if(Array.isArray(sub)){
                        sub.forEach( d => str += this.mixin(token[2], d))
                    }
                    break;
           }
           return str
        }, '')
    }

    // 渲染到Dom
    render(selector) {
        let dom = document.querySelector(selector)
        if(dom){
            dom.innerHTML = this.domstr
        }
    }
}

/******************** 工具方法 *********************/

const get = (from, selectors) =>
    selectors   
      .replace(/\[([^\[\]]*)\]/g, '.$1.')
      .split('.')
      .filter(t => t !== '')
      .reduce((prev, cur) => prev && prev[cur], from)


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