#         4
#       /   \
#      2     6
#     / \   / \
#    1   3|5   7


class Node:
    def __init__(self, data):
        self.left = None
        self.right = None
        self.data = data

    # Insert Node
    def insert(self, data):
        if self.data:
            if data < self.data:
                if self.left is None:
                    self.left = Node(data)
                else:
                    self.left.insert(data)
            elif data > self.data:
                if self.right is None:
                    self.right = Node(data)
                else:
                    self.right.insert(data)
        else:
            self.data = data

    def pre_order_traversal(self, node):
        if not node:
            return
        self.visit(node)
        self.pre_order_traversal(node.left)
        self.pre_order_traversal(node.right)

    def in_order_traversal(self, node):
        if not node:
            return
        self.in_order_traversal(node.left)
        self.visit(node)
        self.in_order_traversal(node.right)

    def post_order_traversal(self, node):
        if not node:
            return
        self.post_order_traversal(node.left)
        self.post_order_traversal(node.right)
        self.visit(node)

    def visit(self, node):
        print(str(node.data) + "  ", end ='')


# Create tree.
root = Node(4)
root.insert(2)
root.insert(1)
root.insert(3)
root.insert(6)
root.insert(5)
root.insert(7)

# Traverse.
print("***************** Pre_order traversal ******************")
root.pre_order_traversal(root)
print()
print("***************** In_order traversal ******************")
root.in_order_traversal(root)
print()
print("***************** Post_order traversal ******************")
root.post_order_traversal(root)

