///<reference path="templater.ts"/>

var defaultFields = ["projectShortName", "numberInProject", "summary", "description", "created", "updated", "resolved",
    "updaterName", "updaterFullName", "reporterName", "reporterFullName", "commentsCount", "votes", "attachments", "links"];

class AUser extends Atomic<User> {}
class User {
    firstName = new AString;
    lastName = new AString;

    constructor(obj:any = {}) {
        Object.freeze(this);
        this.firstName.set = obj.firstName;
        this.lastName.set = obj.lastName;
    }
}

class $W {
    issues = new AList<Issue>();

    constructor() {
        Object.freeze(this);
    }
}

class UserComment {
    author = new AString;
    authorFullName = new AString;
    created = new ANumber;
    deleted = new ANumber;
    updated = new ANumber;
    id = new AString;
    text = new AString;

    constructor(obj:any = {}) {
        this.author.set = obj.author;
        this.authorFullName.set = obj.authorFullName;
        this.created.set = obj.created;
        this.deleted.set = obj.deleted;
        this.updated.set = obj.updated;
        this.id.set = obj.id;
        this.text.set = obj.text;
    }
}

class IssueLink {
    url = new AString;
    value = new AString;

    constructor(obj:any = {}) {
        this.url.set = 'http://youtrack.jetbrains.com/issue/' + obj.value;
        this.value.set = obj.value;
    }
}

class IssueAttachment {
    url = new AString;
    value = new AString;

    constructor(obj:any = {}) {
        this.url.set = obj.url;
        this.value.set = obj.value;
    }
}
class Issue {
    id = new ANumber;
    projectShortName = new AString;
    numberInProject = new AString;
    summary = new AString;
    description = new AString;
    created = new ANumber;
    updated = new ANumber;
    updaterName = new AString;
    updaterFullName = new AString;
    reporterName = new AString;
    reporterFullName = new AString;
    priority = new AString;
    type = new AString;
    state = new AString;
    assignee = new AString;
    subsystem = new AString;
    fixVersions = new AString;
    affectedVersion = new AString;
    severity = new AString;

    votes = new ANumber;
    commentsCount = new ANumber;
    comments = new AList<UserComment>();
    links = new AList<IssueLink>();
    attachments = new AList<IssueAttachment>();

    constructor(obj:any = {}) {
        var fields = obj.fields;
        Object.freeze(this);
        this.id.set = obj.id;
        this.summary.set = fields.summary;
        this.description.set = fields.description || '';
        this.created.set = fields.created;
        this.projectShortName.set = fields.projectShortName;
        this.numberInProject.set = fields.numberInProject;
        this.updated.set = fields.updated;
        this.updaterName.set = fields.updaterName;
        this.updaterFullName.set = fields.updaterFullName;
        this.reporterName.set = fields.reporterName;
        this.reporterFullName.set = fields.reporterFullName;
        this.votes.set = fields.votes;
        this.commentsCount.set = fields.commentsCount;

        this.priority.set = fields.Priority[0];
        this.state.set = fields.State[0];
        this.type.set = fields.Type[0];
        this.assignee.set = fields.Assignee && fields.Assignee[0].fullName;
        this.subsystem.set = fields.Subsystem[0];
        this.fixVersions.set = fields['Fix versions'] && fields['Fix versions'][0];
        this.affectedVersion.set = fields['Affected versions'] && fields['Affected versions'][0];
        this.severity.set = fields.Severity;

        for (var i = 0; i < obj.comment.length; i++) {
            this.comments.add(new UserComment(obj.comment[i]));
        }

        if (obj.fields.attachments) {
            for (var i = 0; i < obj.fields.attachments.length; i++) {
                this.attachments.add(new IssueAttachment(obj.fields.attachments[i]));
            }
        }

        if (obj.fields.links) {
            for (var i = 0; i < obj.fields.links.length; i++) {
                this.links.add(new IssueLink(obj.fields.links[i]));
            }
        }

    }
}
/*

 var $w = new $W;

 //$w.issues.get.push(new Issue({id: 1, title: "lala1"}));
 $w.issues.add(new Issue({id: 1, title: '123', description: '123', created: 3324545, updated: 23423}));
 $w.issues.get(0).users.add(new User({firstName: 'bababa', lastName: 'asbababa'}));

 var a = new Atomic<number>(100);
 var b = new Atomic<number>(()=>a.get + 100);
 console.log(b.get);
 a.set = 500;
 console.log(b.get);

 var c = new Atomic(()=>$w.issues.get(0).user.get.firstName.get);
 c.addListener(function (val) {
 console.log("Changed", val);

 });

 $w.issues.get(0).user.get.firstName.set = 'Steven';
 $w.issues.get(0).user.set = new User({firstName: 'Ali', lastName: 'Baba'});
 $w.issues.get(0).user.set = new User({firstName: 'John', lastName: 'Marko'});

 for (var i = 0; i < 100; i++) {
 $w.issues.add(new Issue({
 id: i,
 title: 'John ' + i,
 description: i + i + i,
 created: 10000 + i,
 updated: 20000 + i
 }));
 }

 data.forEach(function (issue) {
 issue.fields = {};
 issue.field.forEach(function (field) {
 issue.fields[field.name] = field.value;
 });
 });
 */

declare var data:any[];

var $w = new $W();
var first = data[0];
first.fields.links = [{value: '12312312'}];

//$w.issues.add(new Issue(first));

for (var i = 0; i < data.length; i++) {
    $w.issues.add(new Issue(data[i]));
}

function wrapText(text, len) {
    return text && text.length > len ? text.substr(0, len) + '...' : text;
}

function doLayout() {

    console.profile('perf');
    console.time('perf');
    render(document.getElementById('test'),
        $a('div', null,
            $w.issues.map((issue)=>
                    $a('div.issue', null,
                        $a('div.line', null,
                            $a('span.field', null, 'ID:'),
                            $a('span', null, ()=>issue.id.get)
                        ),
                        $a('div.line', null,
                            $a('span.field', null, 'Summary:'),
                            $a('span', null, ()=>issue.summary.get)
                        ),
                        $a('div.line', null,
                            $a('span.field', null, 'Description:'),
                            $a('span', null, ()=>wrapText(issue.description.get, 100))
                        ),

                        $a("div", null,
                            $a("span.field", null, "Reporter:"),
                            $a("span.value", null, ()=>issue.reporterFullName.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Updater:"),
                            $a("span.value", null, ()=>issue.updaterFullName.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Priority:"),
                            $a("span.value", null, ()=>issue.priority.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Type:"),
                            $a("span.value", null, ()=>issue.type.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "State:"),
                            $a("span.value", null, ()=>issue.state.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Assignee:"),
                            $a("span.value", null, ()=>issue.assignee.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Subsystem:"),
                            $a("span.value", null, ()=>issue.subsystem.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Fix versions:"),
                            $a("span.value", null, ()=>issue.fixVersions.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Affected versions:"),
                            $a("span.value", null, ()=>issue.affectedVersion.get)
                        ),
                        $a("div", null,
                            $a("span.field", null, "Severity:"),
                            $a("span.value", null, ()=>issue.severity.get)
                        ),

                        $a("div", null,
                            $a("span.field", null, "Links:"),
                            $a("span.value", null,
                                map(issue.links, (link)=>
                                    $a("a", {target: "_blank", href: link.url.get}, ()=>link.value.get), ', ')
                            )
                        ),
                        $a("div", null,
                            $a("span.field", null, "Attachments:"),
                            $a("span.value", null, issue.attachments.map((attach) =>
                                    $a("a", {target: "_blank", href: attach.url.get}, ()=>attach.value.get), ', ')
                            )
                        ),

                        $a("div.comments", null,
                            $a("div.title", null, "Comments"),
                            issue.comments.map((comment) =>
                                    $a("div.comment", null,
                                        $a("div.author", null, ()=>comment.authorFullName.get),
                                        $a("div.text", null, ()=>comment.text.get)
                                    )
                            )
                        )
                    )
            )
        )
    );

    console.timeEnd('perf');
    console.profileEnd('perf');

    console.log($w);

}

interface Console {
    profileEnd(name:string);
}
