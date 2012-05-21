(function(a,b,c){var d=function(){return c.View.extend({fields:null,initialize:function(a){this.schema=function(){if(a.schema)return a.schema;var c=a.model;if(!c)throw new Error("Could not find schema");return b.isFunction(c.schema)?c.schema():c.schema}(),this.model=a.model,this.data=a.data,this.fieldsToRender=a.fields||b.keys(this.schema),this.fieldsets=a.fieldsets,this.templateName=a.template||"form",this.fields={}},render:function(){var c=this,e=this.fieldsets,f=d.templates,g=a(f[this.templateName]({fieldsets:'<div class="bbf-placeholder"></div>'})),h=a(".bbf-placeholder",g);return e||(e=[{fields:this.fieldsToRender}]),b.each(e,function(d){b(d).isArray()&&(d={fields:d});var e=a(f.fieldset(b.extend({},d,{legend:d.legend?"<legend>"+d.legend+"</legend>":"",fields:'<div class="bbf-placeholder"></div>'}))),g=a(".bbf-placeholder",e);c.renderFields(d.fields,g),g=g.children().unwrap(),h.append(e)}),h.children().unwrap(),this.setElement(g),this},renderFields:function(a,c){var e=this,f=this.schema,g=this.model,h=this.data,i=this.fields,j=d.helpers.getNested;b.each(a,function(a){var b=function(){if(f[a])return f[a];var b=a.replace(/\./g,".subSchema.");return j(f,b)}();if(!b)throw"Field '"+a+"' not found in schema";var k={form:e,key:a,schema:b,idPrefix:e.options.idPrefix};g?k.model=g:h?k.value=h[a]:k.value=null;var l=new d.Field(k);b.type=="Hidden"?l.editor=d.helpers.createEditor("Hidden",k):c.append(l.render().el),i[a]=l})},validate:function(){var a=this,c=this.fields,d=this.model,e={};b.each(c,function(a){var b=a.validate();b&&(e[a.key]=b)});if(d&&d.validate){var f=d.validate(this.getValue());if(f){var g=b.isObject(f)&&!b.isArray(f);g||(e._others=e._others||[],e._others.push(f)),g&&b.each(f,function(b,c){if(a.fields[c]&&!e[c])a.fields[c].setError(b);else{e._others=e._others||[];var d={};d[c]=b,e._others.push(d)}})}}return b.isEmpty(e)?null:e},commit:function(){var a=this.validate();if(a)return a;var b;this.model.set(this.getValue(),{error:function(a,c){b=c}});if(b)return b},getValue:function(a){if(a)return this.fields[a].getValue();var c={};return b.each(this.fields,function(a){c[a.key]=a.getValue()}),c},setValue:function(a){for(var b in a)this.fields[b].setValue(a[b])},remove:function(){var a=this.fields;for(var b in a)a[b].remove();c.View.prototype.remove.call(this)}})}(),e={form:'      <form class="bbf-form">{{fieldsets}}</form>    ',fieldset:"      <fieldset>        {{legend}}        <ul>{{fields}}</ul>      </fieldset>    ",field:'    <li class="bbf-field bbf-field{{type}}">      <label for="{{id}}">{{title}}</label>      <div class="bbf-editor bbf-editor{{type}}">{{editor}}</div>      <div class="bbf-help">{{help}}</div>    </li>    '},f={error:"bbf-error"};d.helpers=function(){var a={};return a.getNested=function(a,b){var c=b.split("."),d=a;for(var e=0,f=c.length;e<f;e++)d=d[c[e]];return d},a.keyToTitle=function(a){return a=a.replace(/([A-Z])/g," $1"),a=a.replace(/^./,function(a){return a.toUpperCase()}),a},a.compileTemplate=function(a){var c=b.templateSettings.interpolate;b.templateSettings.interpolate=/\{\{(.+?)\}\}/g;var d=b.template(a);return b.templateSettings.interpolate=c,d},a.createTemplate=function(b,c){var d=a.compileTemplate(b);return c?d(c):d},a.setTemplateCompiler=function(b){a.compileTemplate=b},a.setTemplates=function(c,e){var f=a.createTemplate;d.templates=d.templates||{},d.classNames=d.classNames||{},b.each(c,function(a,c,e){b.isString(a)&&(a=f(a)),d.templates[c]=a}),b.extend(d.classNames,e)},a.createEditor=function(a,c){var e;return b.isString(a)?e=d.editors[a]:e=a,new e(c)},a.triggerCancellableEvent=function(a,b,c,d){if(!a._callbacks||!a._callbacks[b])return d();var e=a._callbacks[b].next;if(!e)return d();var f=e.callback,g=e.context||this;c.push(d),f.apply(g,c)},a.getValidator=function(a){var c=d.validators;if(b.isRegExp(a))return c.regexp({regexp:a});if(b.isString(a)){if(!c[a])throw new Error('Validator "'+a+'" not found');return c[a]()}if(b.isFunction(a))return a;if(b.isObject(a)&&a.type){var e=a;return c[e.type](e)}throw new Error("Invalid validator: "+a)},a}(),d.validators=function(){var a={};return a.errMessages={required:"Required",regexp:"Invalid",email:"Invalid email address",url:"Invalid URL",match:'Must match field "{{field}}"'},a.required=function(a){return a=b.extend({type:"required",message:this.errMessages.required},a),function(c){a.value=c;var e={type:a.type,message:d.helpers.createTemplate(a.message,a)};if(c===null||c===undefined||c==="")return e}},a.regexp=function(a){if(!a.regexp)throw new Error('Missing required "regexp" option for "regexp" validator');return a=b.extend({type:"regexp",message:this.errMessages.regexp},a),function(c){a.value=c;var e={type:a.type,message:d.helpers.createTemplate(a.message,a)};if(c===null||c===undefined||c==="")return;if(!a.regexp.test(c))return e}},a.email=function(c){return c=b.extend({type:"email",message:this.errMessages.email,regexp:/^[\w\-]{1,}([\w\-.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/},c),a.regexp(c)},a.url=function(c){return c=b.extend({type:"url",message:this.errMessages.url,regexp:/^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i},c),a.regexp(c)},a.match=function(a){if(!a.field)throw new Error('Missing required "field" options for "match" validator');return a=b.extend({type:"match",message:this.errMessages.match},a),function(c,e){a.value=c;var f={type:a.type,message:d.helpers.createTemplate(a.message,a)};if(c===null||c===undefined||c==="")return;if(c!=e[a.field])return f}},a}(),d.Field=function(){var e=d.helpers,f=d.templates;return c.View.extend({initialize:function(a){this.form=a.form,this.key=a.key,this.value=a.value,this.model=a.model;var c=this.schema=function(){return b.isString(a.schema)?{type:a.schema}:a.schema||{}}();c.type||(c.type="Text"),c.title||(c.title=e.keyToTitle(this.key)),c.template||(c.template="field")},render:function(){var b=this.schema,c=d.templates,f={form:this.form,key:this.key,schema:b,idPrefix:this.options.idPrefix,id:this.getId()};this.model?f.model=this.model:f.value=this.value;var g=this.editor=e.createEditor(b.type,f),h=a(c[b.template]({key:this.key,title:b.title,id:g.id,type:b.type,editor:'<span class="bbf-placeholder-editor"></span>',help:'<span class="bbf-placeholder-help"></span>'})),i=a(".bbf-placeholder-editor",h);return i.append(g.render().el),i.children().unwrap(),this.$help=a(".bbf-placeholder-help",h).parent(),this.$help.empty(),this.schema.help&&this.$help.html(this.schema.help),this.schema.fieldClass&&h.addClass(this.schema.fieldClass),this.schema.fieldAttrs&&h.attr(this.schema.fieldAttrs),this.setElement(h),this},getId:function(){var a=this.options.idPrefix,c=this.key;return c=c.replace(/\./g,"_"),b.isString(a)||b.isNumber(a)?a+c:b.isNull(a)?c:this.model?this.model.cid+"_"+c:c},validate:function(){var a=this.editor.validate();return a?this.setError(a.message):this.clearError(),a},setError:function(a){if(this.editor.hasNestedForm)return;var b=d.classNames.error;this.$el.addClass(b),this.$help&&this.$help.html(a)},clearError:function(){var a=d.classNames.error;this.$el.removeClass(a);if(this.$help){this.$help.empty();var b=this.schema.help;b&&this.$help.html(b)}},commit:function(){return this.editor.commit()},getValue:function(){return this.editor.getValue()},setValue:function(a){this.editor.setValue(a)},logValue:function(){if(!console||!console.log)return;console.log(this.getValue())},remove:function(){this.editor.remove(),c.View.prototype.remove.call(this)}})}(),d.editors=function(){var e={};return e.Base=c.View.extend({defaultValue:null,initialize:function(a){var a=a||{};if(a.model){if(!a.key)throw"Missing option: 'key'";this.model=a.model,this.key=a.key,this.value=this.model.get(this.key)}else a.value&&(this.value=a.value);this.value===undefined&&(this.value=this.defaultValue),this.form=a.form,this.schema=a.schema||{},this.validators=a.validators||this.schema.validators,this.$el.attr("name",this.getName()),this.schema.editorClass&&this.$el.addClass(this.schema.editorClass),this.schema.editorAttrs&&this.$el.attr(this.schema.editorAttrs)},getValue:function(){throw"Not implemented. Extend and override this method."},setValue:function(){throw"Not implemented. Extend and override this method."},getName:function(){var a=this.key||"";return a.replace(/\./g,"_")},commit:function(){var a=this.validate();if(a)return a;this.model.set(this.key,this.getValue(),{error:function(b,c){a=c}});if(a)return a},validate:function(){var a=this.$el,c=null,e=this.getValue(),f=this.form?this.form.getValue():{},g=this.validators,h=d.helpers.getValidator;return g&&b.each(g,function(a){c||(c=h(a)(e,f))}),c}}),e.Text=e.Base.extend({tagName:"input",defaultValue:"",initialize:function(a){e.Base.prototype.initialize.call(this,a);var b=this.schema,c="text";b&&b.editorAttrs&&b.editorAttrs.type&&(c=b.editorAttrs.type),b&&b.dataType&&(c=b.dataType),this.$el.attr("type",c)},render:function(){return this.setValue(this.value),this},getValue:function(){return this.$el.val()},setValue:function(a){this.$el.val(a)}}),e.Number=e.Text.extend({defaultValue:0,events:{keypress:"onKeyPress"},initialize:function(a){e.Text.prototype.initialize.call(this,a),this.$el.attr("type","number")},onKeyPress:function(a){if(a.charCode==0)return;var b=this.$el.val()+String.fromCharCode(a.charCode),c=/^[0-9]*\.?[0-9]*?$/.test(b);c||a.preventDefault()},getValue:function(){var a=this.$el.val();return a===""?null:parseFloat(a,10)},setValue:function(a){a=a===null?null:parseFloat(a,10),e.Text.prototype.setValue.call(this,a)}}),e.Password=e.Text.extend({initialize:function(a){e.Text.prototype.initialize.call(this,a),this.$el.attr("type","password")}}),e.TextArea=e.Text.extend({tagName:"textarea"}),e.Checkbox=e.Base.extend({defaultValue:!1,tagName:"input",initialize:function(a){e.Base.prototype.initialize.call(this,a),this.$el.attr("type","checkbox")},render:function(){return this.setValue(this.value),this},getValue:function(){return this.$el.attr("checked")?!0:!1},setValue:function(a){a&&this.$el.attr("checked",!0)}}),e.Hidden=e.Base.extend({defaultValue:"",initialize:function(a){e.Text.prototype.initialize.call(this,a),this.$el.attr("type","hidden")},getValue:function(){return this.value},setValue:function(a){this.value=a}}),e.Select=e.Base.extend({tagName:"select",initialize:function(a){e.Base.prototype.initialize.call(this,a);if(!this.schema||!this.schema.options)throw"Missing required 'schema.options'"},render:function(){var a=this.schema.options,d=this;if(a instanceof c.Collection){var e=a;e.length>0?d.renderOptions(a):e.fetch({success:function(b){d.renderOptions(a)}})}else b.isFunction(a)?a(function(a){d.renderOptions(a)}):d.renderOptions(a);return this},renderOptions:function(a){var d=this.$el,e;b.isString(a)?e=a:b.isArray(a)?e=this._arrayToHtml(a):a instanceof c.Collection&&(e=this._collectionToHtml(a)),d.html(e),this.setValue(this.value)},getValue:function(){return this.$el.val()},setValue:function(a){this.$el.val(a)},_collectionToHtml:function(a){var b=[];a.each(function(a){b.push({val:a.id,label:a.toString()})});var c=this._arrayToHtml(b);return c},_arrayToHtml:function(a){var c=[];return b.each(a,function(a){if(b.isObject(a)){var d=a.val?a.val:"";c.push('<option value="'+d+'">'+a.label+"</option>")}else c.push("<option>"+a+"</option>")}),c.join("")}}),e.Radio=e.Select.extend({tagName:"ul",className:"bbf-radio",getValue:function(){return this.$el.find("input[type=radio]:checked").val()},setValue:function(a){this.$el.find("input[type=radio][value="+a+"]").attr("checked",!0)},_arrayToHtml:function(a){var c=[],d=this;return b.each(a,function(a,e){var f="<li>";if(b.isObject(a)){var g=a.val?a.val:"";f+='<input type="radio" name="'+d.id+'" value="'+g+'" id="'+d.id+"-"+e+'" />',f+='<label for="'+d.id+"-"+e+'">'+a.label+"</label>"}else f+='<input type="radio" name="'+d.id+'" value="'+a+'" id="'+d.id+"-"+e+'" />',f+='<label for="'+d.id+"-"+e+'">'+a+"</label>";f+="</li>",c.push(f)}),c.join("")}}),e.Checkboxes=e.Select.extend({tagName:"ul",className:"bbf-checkboxes",getValue:function(){var b=[];return this.$el.find("input[type=checkbox]:checked").each(function(){b.push(a(this).val())}),b},setValue:function(a){var c=this;b.each(a,function(a){c.$el.find('input[type=checkbox][value="'+a+'"]').attr("checked",!0)})},_arrayToHtml:function(a){var c=[],d=this;return b.each(a,function(a,e){var f="<li>";if(b.isObject(a)){var g=a.val?a.val:"";f+='<input type="checkbox" name="'+d.id+'" value="'+g+'" id="'+d.id+"-"+e+'" />',f+='<label for="'+d.id+"-"+e+'">'+a.label+"</label>"}else f+='<input type="checkbox" name="'+d.id+'" value="'+a+'" id="'+d.id+"-"+e+'" />',f+='<label for="'+d.id+"-"+e+'">'+a+"</label>";f+="</li>",c.push(f)}),c.join("")}}),e.Object=e.Base.extend({hasNestedForm:!0,className:"bbf-object",defaultValue:{},initialize:function(a){e.Base.prototype.initialize.call(this,a);if(!this.schema.subSchema)throw"Missing required 'schema.subSchema' option for Object editor"},render:function(){var a=this.$el,b=this.value||{},c=this.key,e=this.schema,f=e.subSchema;return this.form=new d({schema:f,data:b,idPrefix:this.id+"_"}),a.html(this.form.render().el),this},getValue:function(){return this.form.getValue()},setValue:function(a){this.value=a,this.render()},remove:function(){this.form.remove(),c.View.prototype.remove.call(this)},validate:function(){return this.form.validate()}}),e.NestedModel=e.Object.extend({initialize:function(a){e.Base.prototype.initialize.call(this,a);if(!a.schema.model)throw'Missing required "schema.model" option for NestedModel editor'},render:function(){var a=this.value||{},c=this.key,e=this.schema.model,f=e.prototype.schema;return b.isFunction(f)&&(f=f()),this.form=new d({schema:f,model:new e(a),idPrefix:this.id+"_"}),this.$el.html(this.form.render().el),this},commit:function(){var a=this.form.commit();return a?(this.$el.addClass("error"),a):e.Object.prototype.commit.call(this)}}),e}(),d.setTemplates=d.helpers.setTemplates,d.setTemplateCompiler=d.helpers.setTemplateCompiler,d.setTemplates(e,f),c.Form=c.Form||d;if(typeof define=="function"&&define.amd)return define(function(){return d});if(typeof module=="object"&&typeof module.exports=="object"){module.exports=d;return}})(jQuery,_,Backbone)