import { Form } from "../Types/form";
import { Group, GroupLayout } from "../Types/group";
import { Widget } from "../Types/widget";

export class LayoutBuilder {
    public build(form: Form) {
        form.updateMarginedProperties();
        this.buildGroup(form);
    }

    private buildGroup(group: Group) {
        switch (group.layout) {
            case GroupLayout.LeftToRight:
                this.buildGroupLeftToRight(group);
                break;
            case GroupLayout.TopToBottom:
                this.buildGroupTopToBottom(group);
                break;
        }
        for (let i = 0; i < group.children?.length; i++) {
            const child = group.children[i];
            if (child.type === `group`) {
                this.buildGroup(child as Group);
            }
        }
    }

    private buildGroupLeftToRight(group: Group) {
        let top = group.top;
        let left = group.left;
        let nextTop = -1;
        for (let i = 0; i < group.children?.length; i++) {
            const child = group.children[i];
            if (child.top !== top || child.left !== left) {
                child.top = top + child.paddingTop;
                child.left = left + child.paddingLeft;
                child.updateMarginedProperties();
            }
            left = child.marginedRight;
            nextTop = Math.max(nextTop, child.marginedBottom);
            if (group.width <= left) {
                top = nextTop;
                left = group.left;
            }
        }
    }

    private buildGroupTopToBottom(group: Group) {
        let top = group.top;
        let left = group.left;
        let nextLeft = -1;
        for (let i = 0; i < group.children?.length; i++) {
            const child = group.children[i];
            if (child.top !== top || child.left !== left) {
                child.top = top + child.paddingTop;
                child.left = left + child.paddingLeft;
                child.updateMarginedProperties();
            }
            top = child.marginedBottom;
            nextLeft = Math.max(nextLeft, child.marginedRight);
            if (group.height <= top) {
                top = group.top;
                left = nextLeft;
            }
        }
    }
}

if (global.testing) {
    global.LayoutBuilder = LayoutBuilder;
}
