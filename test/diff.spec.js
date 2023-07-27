describe('Diff', function(){
    var cut, res, html_to_tokens, calculate_operations, setAtomicTagsRegExp;
  
    beforeEach(function(){
      cut = require('../js/htmldiff');
      html_to_tokens = cut.htmlToTokens;
      calculate_operations = cut.calculateOperations;
      setAtomicTagsRegExp = cut.setAtomicTagsRegExp;
      var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,ol,li,ul';
      setAtomicTagsRegExp(tags);
    });
  
    describe('When both inputs are the same', function(){
      beforeEach(function(){
        res = cut('input text', 'input text');
      });
  
      it('should return the text', function(){
        expect(res).equal('input text');
      });
    }); // describe('When both inputs are the same')
  
    describe('When a letter is added', function(){
      beforeEach(function(){
        res = cut('input', 'input 2');
      });
  
      it('should mark the new letter', function(){
        expect(res).to.equal('input<ins data-operation-index="1"> 2</ins>');
      });
    }); // describe('When a letter is added')
  
    describe('Whitespace differences', function(){
      it('should collapse adjacent whitespace', function(){
        expect(cut('Much \n\t    spaces', 'Much spaces')).to.equal('Much spaces');
      });
  
      it('should consider non-breaking spaces as equal', function(){
        expect(cut('Hello&nbsp;world', 'Hello&#160;world')).to.equal('Hello&#160;world');
      });
  
      it('should consider non-breaking spaces and non-adjacent regular spaces as equal', function(){
        expect(cut('Hello&nbsp;world', 'Hello world')).to.equal('Hello world');
      });
    }); // describe('Whitespace differences')
  
    describe('When a class name is specified', function(){
      it('should include the class in the wrapper tags', function(){
        expect(cut('input', 'input 2', 'diff-result')).to.equal(
          'input<ins data-operation-index="1" class="diff-result"> 2</ins>');
      });
    }); // describe('When a class name is specified')
  
    describe('Image Differences', function(){
      it('show two images as different if their src attributes are different', function() {
        var before = html_to_tokens('<img src="a.jpg">');
        var after = html_to_tokens('<img src="b.jpg">');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
  
      it('should show two images are different if they change properties', function() {
        var before = html_to_tokens('<img src="a.jpg">');
        var after = html_to_tokens('<img src="a.jpg" alt="hey!">');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });

      it('should show two images are the same if nothing changed', function() {
        var before = html_to_tokens('<img src="a.jpg">');
        var after = html_to_tokens('<img src="a.jpg">');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'equal',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
    }); // describe('Image Differences')
    
    describe('Widget Differences', function(){
      it('show two widgets as different if their data attributes are different', function() {
        var before = html_to_tokens('<object data="a.jpg"></object>');
        var after = html_to_tokens('<object data="b.jpg"></object>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
  
      it('should show two widgets are different if their metadata change', function() {
        var before = html_to_tokens('<object data="a.jpg"><param>yo!</param></object>');
        var after = html_to_tokens('<object data="a.jpg"></object>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });

      it('should show two widgets as equals if nothing change on tem', function() {
        var before = html_to_tokens('<object data="a.jpg"></object>');
        var after = html_to_tokens('<object data="a.jpg"></object>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'equal',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
    }); // describe('Widget Differences')
  
      describe('Math Differences', function(){
      it('should show two math elements as different if their contents are different', function() {
        var before = html_to_tokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
          '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
        var after = html_to_tokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
          '<msup><mn>b</mn><mn>5</mn></msup></msqrt></math>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
  
      it('should show two math elements as different if their metadata change', function() {
        var before = html_to_tokens('<math data-uuid="15568cd906504876548459e80e356878"><msqrt>' +
          '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
        var after = html_to_tokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
          '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });

      it('should show two math elements as equals if nothing change on tem', function() {
        var before = html_to_tokens('<math data-uuid="15568cd906504876548459e80e356878"><msqrt>' +
          '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
        var after = html_to_tokens('<math data-uuid="15568cd906504876548459e80e356878"><msqrt>' +
          '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'equal',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
    }); // describe('Math Differences')
  
    describe('Video Differences', function(){
      it('show two widgets as different if their data attributes are different', function() {
        var before = html_to_tokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
          '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
        var after = html_to_tokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
          '<source src="inkling-video:///big_buck_rabbit/mp4" type="video/webm" /></video>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
  
      });
  
      it('should show two widgets as different if their classes change', function() {
        var before = html_to_tokens('<video data-uuid="65656565655487787484545454548494">' +
          '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
        var after = html_to_tokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
          '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });

      it('should show two widgets as equal if nothing change', function() {
        var before = html_to_tokens('<video data-uuid="65656565655487787484545454548494">' +
          '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
        var after = html_to_tokens('<video data-uuid="65656565655487787484545454548494">' +
          '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'equal',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
    }); // describe('Video Differences')
  
    describe('iframe Differences', function(){
      it('show two widgets as different if their data attributes are different', function() {
        var before = html_to_tokens('<iframe src="a.jpg"></iframe>');
        var after = html_to_tokens('<iframe src="b.jpg"></iframe>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
  
      it('should show two widgets as different if their classes change', function() {
        var before = html_to_tokens('<iframe src="a.jpg"></iframe>');
        var after = html_to_tokens('<iframe src="a.jpg" class="foo"></iframe>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'replace',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });

      it('should show two widgets as equal if nothing changes', function() {
        var before = html_to_tokens('<iframe src="a.jpg"></iframe>');
        var after = html_to_tokens('<iframe src="a.jpg"></iframe>');
        var ops = calculate_operations(before, after);
        expect(ops.length).to.equal(1);
        expect(ops[0]).to.eql({
          action: 'equal',
          startInBefore: 0,
          endInBefore: 0,
          startInAfter: 0,
          endInAfter: 0
        });
      });
    }); // describe('iframe Differences')
    describe('Html tags changing tests', function(){
      describe('strong', () => {
        it('should see differences on strong text when start is removed', function() {
          var before = '<strong>This line is bold</strong>';
          var after = '<strong>is bold</strong>';
          var ops = cut(before, after );
          expect(ops).to.eql('<del data-operation-index="0"><strong>This line is bold</strong></del><ins data-operation-index="0"><strong>is bold</strong></ins>');
        });
        it('should see differences on strong text when end is removed', function() {
          var before = '<strong>This line is bold</strong>';
          var after = '<strong>This line</strong>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><strong>This line is bold</strong></del><ins data-operation-index="0"><strong>This line</strong></ins>');
        });
        it('should see differences on strong text when middle is removed', function() {
          var before = '<strong>This line is bold</strong>';
          var after = '<strong>This is bold</strong>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><strong>This line is bold</strong></del><ins data-operation-index="0"><strong>This is bold</strong></ins>');
        });
        it('should see differences when strong tag is removed', function() {
          var before = '<strong>This line is bold</strong>';
          var after = 'This line is bold';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><strong>This line is bold</strong></del><ins data-operation-index="0">This line is bold</ins>');
        });
        it('should see differences when strong tag is replaced', function() {
          var before = '<strong>This line is bold</strong>';
          var after = '<i>This line is bold</i>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><strong>This line is bold</strong></del><ins data-operation-index="0"><i>This line is bold</i></ins>');
        });
      });

      describe('italic', () => {
        it('should see differences when formatting is removed', function() {
          var before ='<i>This line is italic</i>';
          var after = 'This line is italic';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><i>This line is italic</i></del><ins data-operation-index="0">This line is italic</ins>');
        });
      });

      describe('underline', () => {
        it('should see differences when formatting is removed', function() {
          var before ='<u>This line is underscore</u>';
          var after = 'This line is underscore';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><u>This line is underscore</u></del><ins data-operation-index="0">This line is underscore</ins>');
        });
      });

      describe('strikethrough', () => {
        it('should see differences when formatting is replaced', function() {
          var before ='<s>This line is strikethrough</s>';
          var after = '<strong>This line is strikethrough</strong>';
          var ops = cut(before, after);
          expect(ops).to.eql('<s data-diff-node="del" data-operation-index="0"><del data-operation-index="0">This line is strikethrough</del></s><ins data-operation-index="0"><strong>This line is strikethrough</strong></ins>');
        });
      });

      describe('super script', () => {
        it('should see differences when formatting is removed', function() {
          var before ='<sup>This line is super script</sup>';
          var after = 'This line is super script';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><sup>This line is super script</sup></del><ins data-operation-index="0">This line is super script</ins>');
        });
      });

      describe('url', () => {
        it('should distinguish url change',  () => {
          var before = '<a href="https://google.com/"><span>this is a url test</span></a>';
          var after = '<a href="https://bing.com/"><span>this is a url test</span></a>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><a href="https://google.com/"><span>this is a url test</span></a></del><ins data-operation-index="0"><a href="https://bing.com/"><span>this is a url test</span></a></ins>');
        });
      });

      describe('img', () => {
        it('should distinguish img attribute change',  () => {
          var before = '<img href="https://some.url.com/?authToken=token123abbbaaaa&projectId=1234attachmentId=123"/>';
          var after = '<img href="https://some.url.com/?authToken=token123abbbaaaa&projectId=1234attachmentId=456"/>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><img href="https://some.url.com/?authToken=token123abbbaaaa&projectId=1234attachmentId=123"/></del><ins data-operation-index="0"><img href="https://some.url.com/?authToken=token123abbbaaaa&projectId=1234attachmentId=456"/></ins>');
        });
      });

      describe('bullet point', () => {
        it('should distinguish point changes',  () => {
          var before = '<ul><li>point one</li><li>point two</li><li>point three</li></ul>';
          var after = '<ul><li>point 1</li><li>point new</li><li>point two</li><li>point three</li></ul>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><ul><li>point one</li><li>point two</li><li>point three</li></ul></del><ins data-operation-index="0"><ul><li>point 1</li><li>point new</li><li>point two</li><li>point three</li></ul></ins>');
        });

        it('should distinguish point changes',  () => {
          var before = '<ol><li>numner one</li><li>number two</li><li>number three</li></ol>';
          var after = '<ol><li>number one</li><li>number 2</li><li>number new</li><li>number three</li></ol>';
          var ops = cut(before, after);
          expect(ops).to.eql('<del data-operation-index="0"><ol><li>numner one</li><li>number two</li><li>number three</li></ol></del><ins data-operation-index="0"><ol><li>number one</li><li>number 2</li><li>number new</li><li>number three</li></ol></ins>');
        });
      });
    }); // describe('Html tags changing tests')
    
    describe('Bullet points as atomic and not atomic', function(){

      it("should mark entire bullet point as changed if anything changes (with text before)", function(){
        var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,ol,li,ul';
        setAtomicTagsRegExp(tags);
        const before = "<p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 1</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 2</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 3</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 4</span></p><p> </p><p> </p><ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul>";
        const after = "<p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 1</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 2</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 4</span></p><p> </p><p> </p><ul><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ul>"

        res = cut(before, after);

        expect(res).to.eql(`<p><span style="font-family:'Arial';font-size:14px;">This is a normal line 1</span></p><p> </p><p><span style="font-family:'Arial';font-size:14px;">This is a normal line 2</span></p><p> </p><p><span style="font-family:'Arial';font-size:14px;">This is a normal line <del data-operation-index="1">3</del></span></p><p data-diff-node="del" data-operation-index="1"></p><p><span style="font-family:'Arial';font-size:14px;"><del data-operation-index="1">This is a normal line </del>4</span></p><p> </p><p> </p><del data-operation-index="3"><ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul></del><ins data-operation-index="3"><ul><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ul></ins>`);
      });

      it("should mark entire bullet point as changed if anything changes (no text before)", function(){
        var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,ol,li,ul';
        setAtomicTagsRegExp(tags);

        const before = "<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul>";
        const after = "<ul><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ul>"

        res = cut(before, after);

        expect(res).to.eql(`<del data-operation-index="0"><ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul></del><ins data-operation-index="0"><ul><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ul></ins>`);
      });

      it("should mark entire numbered list as changed if anything changes", function(){
        var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,ol,li,ul';
        setAtomicTagsRegExp(tags);
        const before = "<p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 1</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 2</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 3</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 4</span></p><p> </p><p> </p><ol><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ol>";
        const after = "<p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 1</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 2</span></p><p> </p><p><span style=\"font-family:'Arial';font-size:14px;\">This is a normal line 4</span></p><p> </p><p> </p><ol><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ol>"

        res = cut(before, after);

        expect(res).to.eql(`<p><span style="font-family:'Arial';font-size:14px;">This is a normal line 1</span></p><p> </p><p><span style="font-family:'Arial';font-size:14px;">This is a normal line 2</span></p><p> </p><p><span style="font-family:'Arial';font-size:14px;">This is a normal line <del data-operation-index="1">3</del></span></p><p data-diff-node="del" data-operation-index="1"></p><p><span style="font-family:'Arial';font-size:14px;"><del data-operation-index="1">This is a normal line </del>4</span></p><p> </p><p> </p><del data-operation-index="3"><ol><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ol></del><ins data-operation-index="3"><ol><li>This is a bullet point line 1</li><li>This point line 3</li><li><strong>This is a bullet point line 4</strong></li><li>This is a new bullet point</li></ol></ins>`);
      });


      it("should see removed point item when bullet point is not entire tag but item is", function(){
        var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,li';
        setAtomicTagsRegExp(tags);

        const before = "<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul>";
        const after = "<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 4</li></ul>";

        res = cut(before, after);

        expect(res).to.eql(`<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><del data-operation-index="1"><li>This is a bullet point line 3</li></del><li>This is a bullet point line 4</li></ul>`);
      });

      it("should see replaced item and new items diff ", function(){
        var tags = 'iframe,object,math,svg,script,video,head,style,a,strong,i,u(?!l),sup,li';
        setAtomicTagsRegExp(tags);

        const before = "<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line 4</li></ul>";
        const after = "<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><li>This is a bullet point line new</li><li>Totlly new bullet point</li></ul>";

        res = cut(before, after);

        expect(res).to.eql(`<ul><li>This is a bullet point line 1</li><li>This is a bullet point line 2</li><li>This is a bullet point line 3</li><del data-operation-index="1"><li>This is a bullet point line 4</li></del><ins data-operation-index="1"><li>This is a bullet point line new</li><li>Totlly new bullet point</li></ins></ul>`);
      });
    }); // describe('Bullet points as atomic and not atomic')

}); // describe('Diff')