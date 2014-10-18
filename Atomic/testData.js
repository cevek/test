var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var defaultFields = ["projectShortName", "numberInProject", "summary", "description", "created", "updated", "resolved", "updaterName", "updaterFullName", "reporterName", "reporterFullName", "commentsCount", "votes", "attachments", "links"];
var AUser = (function (_super) {
    __extends(AUser, _super);
    function AUser() {
        _super.apply(this, arguments);
    }
    return AUser;
})(Atomic);
var User = (function () {
    function User(obj) {
        if (obj === void 0) { obj = {}; }
        this.firstName = new AString;
        this.lastName = new AString;
        Object.freeze(this);
        this.firstName.set = obj.firstName;
        this.lastName.set = obj.lastName;
    }
    return User;
})();
var $W = (function () {
    function $W() {
        this.issues = new AList();
        Object.freeze(this);
    }
    return $W;
})();
var UserComment = (function () {
    function UserComment(obj) {
        if (obj === void 0) { obj = {}; }
        this.$author = new AString;
        this.$authorFullName = new AString;
        this.$created = new ANumber;
        this.$deleted = new ANumber;
        this.$updated = new ANumber;
        this.$id = new AString;
        this.$text = new AString;
        Atomic.createGetters(this);
        this.author = obj.author;
        this.authorFullName = obj.authorFullName;
        this.created = obj.created;
        this.deleted = obj.deleted;
        this.updated = obj.updated;
        this.id = obj.id;
        this.text = obj.text;
    }
    return UserComment;
})();
var IssueLink = (function () {
    function IssueLink(obj) {
        if (obj === void 0) { obj = {}; }
        this.$url = new AString;
        this.$value = new AString;
        Atomic.createGetters(this);
        this.url = 'http://youtrack.jetbrains.com/issue/' + obj.value;
        this.value = obj.value;
    }
    return IssueLink;
})();
var IssueAttachment = (function () {
    function IssueAttachment(obj) {
        if (obj === void 0) { obj = {}; }
        this.$url = new AString;
        this.$value = new AString;
        this.url = obj.url;
        this.value = obj.value;
    }
    return IssueAttachment;
})();
var Issue = (function () {
    function Issue(obj) {
        if (obj === void 0) { obj = {}; }
        this.$id = new ANumber;
        this.$projectShortName = new AString;
        this.$numberInProject = new AString;
        this.$summary = new AString;
        this.$description = new AString;
        this.$created = new ANumber;
        this.$updated = new ANumber;
        this.$updaterName = new AString;
        this.$updaterFullName = new AString;
        this.$reporterName = new AString;
        this.$reporterFullName = new AString;
        this.$priority = new AString;
        this.$type = new AString;
        this.$state = new AString;
        this.$assignee = new AString;
        this.$subsystem = new AString;
        this.$fixVersions = new AString;
        this.$affectedVersion = new AString;
        this.$severity = new AString;
        this.$votes = new ANumber;
        this.$commentsCount = new ANumber;
        this.comments = new AList();
        this.links = new AList();
        this.attachments = new AList();
        Atomic.createGetters(this);
        var fields = obj.fields;
        this.id = obj.id;
        this.summary = fields.summary;
        this.description = fields.description || '';
        this.created = fields.created;
        this.projectShortName = fields.projectShortName;
        this.numberInProject = fields.numberInProject;
        this.updated = fields.updated;
        this.updaterName = fields.updaterName;
        this.updaterFullName = fields.updaterFullName;
        this.reporterName = fields.reporterName;
        this.reporterFullName = fields.reporterFullName;
        this.votes = fields.votes;
        this.commentsCount = fields.commentsCount;
        this.priority = fields.Priority[0];
        this.state = fields.State[0];
        this.type = fields.Type[0];
        this.assignee = fields.Assignee && fields.Assignee[0].fullName;
        this.subsystem = fields.Subsystem[0];
        this.fixVersions = fields['Fix versions'] && fields['Fix versions'][0];
        this.affectedVersion = fields['Affected versions'] && fields['Affected versions'][0];
        this.severity = fields.Severity;
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
    return Issue;
})();
var $w = new $W();
var first = data[0];
first.fields.links = [{ value: '12312312' }];
for (var i = 0; i < data.length; i++) {
    $w.issues.add(new Issue(data[i]));
}
function wrapText(text, len) {
    return text && text.length > len ? text.substr(0, len) + '...' : text;
}
var PanelView = (function () {
    function PanelView() {
        this.issues = [];
        this.template = doLayout(this);
    }
    PanelView.prototype.itemTemplate = function (issue) {
        if (issue.id == 1)
            return this.itemTemplate;
    };
    return PanelView;
})();
function abc() {
    return $a('div.hello', null, 'ABC');
}
function doLayout(vm) {
    document.getElementById('test').innerHTML = '';
    console.profile('perf');
    console.time('perf');
    render(document.getElementById('test'), $a('div', null, map(vm.issues, function (issue) { return vm.itemTemplate(issue); })));
    console.log(insertBeforeCount);
    console.timeEnd('perf');
    console.profileEnd('perf');
}
function doLayout(vm) {
    document.getElementById('test').innerHTML = '';
    console.time('perf');
    render(document.getElementById('test'), $a('div', null, map($w.issues, function (issue) { return $a('div.issue', null, $a('div.line', null, $a('span.field', null, 'ID:'), $a('span', null, function () { return issue.id + ' / ' + issue.summary; })), $a('div.line', null, $a('span.field', null, 'Summary:'), $a('span', null, function () { return issue.summary; })), $a('div.line', null, $a('span.field', null, 'Description:'), $a('span', null, function () { return wrapText(issue.description, 100); })), $a("div.line", null, $a("span.field", null, "Reporter:"), $a("span.value", null, function () { return issue.reporterFullName; })), $a("div.line", null, $a("span.field", null, "Updater:"), $a("span.value", null, function () { return issue.updaterFullName; })), $a("div.line", null, $a("span.field", null, "Priority:"), $a("span.value", null, function () { return issue.priority; })), $a("div.line", null, $a("span.field", null, "Type:"), $a("span.value", null, function () { return issue.type; })), $a("div.line", null, $a("span.field", null, "State:"), $a("span.value", null, function () { return issue.state; })), $a("div.line", null, $a("span.field", null, "Assignee:"), $a("span.value", null, function () { return issue.assignee; })), $a("div.line", null, $a("span.field", null, "Subsystem:"), $a("span.value", null, function () { return issue.subsystem; })), $a("div.line", null, $a("span.field", null, "Fix versions:"), $a("span.value", null, function () { return issue.fixVersions; })), $a("div.line", null, $a("span.field", null, "Affected versions:"), $a("span.value", null, function () { return issue.affectedVersion; })), $a("div.line", null, $a("span.field", null, "Severity:"), $a("span.value", null, function () { return issue.severity; })), $a("div.line", null, $a("span.field", null, "Links:"), $a("span.value", null, map(issue.links, function (link) { return $a("a", { target: "_blank", href: link.url }, function () { return link.value; }); }, ', '))), $a("div.line", null, $a("span.field", null, "Attachments:"), $a("span.value", null, map(issue.attachments, function (attach) { return $a("a", { target: "_blank", href: attach.url }, function () { return attach.value; }); }, ', '))), $a("div.comments", null, $a("div.title", null, "Comments"), map(issue.comments, function (comment) { return $a("div.comment", null, $a("div.author", null, function () { return comment.authorFullName; }), $a("div.text", null, function () { return comment.text; })); }))); })));
    console.timeEnd('perf');
}
//# sourceMappingURL=testData.js.map