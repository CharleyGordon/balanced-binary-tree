import mergeSort from "./mergeSort.js";

const node = {
  create(content) {
    return {
      content: content,
      find,
      deleteItem,
      find,
      insert,
      levelOrder,
      preOrder,
      inOrder,
      postOrder,
      height,
      depth,
      isBalanced,
      rebalance,
      left: false,
      right: false,
    };
  },
};

const tree = {
  create(array) {
    array = mergeSort(array);
    return createBalancedTree({ array });
  },
};

// creates balanced tree.
// Time complexity: O(n log n)
function createBalancedTree({
  array,
  firstIndex = 0,
  lastIndex = array.length - 1,
}) {
  if (firstIndex > lastIndex) return false;

  const middleIndex = Number.parseInt((firstIndex + lastIndex) / 2);
  const middleElement = array.at(middleIndex);
  const treeNode = node.create(middleElement);

  treeNode.left = createBalancedTree({
    array,
    firstIndex,
    lastIndex: middleIndex - 1,
  });

  treeNode.right = createBalancedTree({
    array,
    firstIndex: middleIndex + 1,
    lastIndex,
  });

  return treeNode;
}

function find({ tree = this, value, returnNode = false }) {
  // works almost as depth first search
  if (!tree) return false;
  // console.dir(tree);

  if (tree.content === value) {
    if (returnNode) return tree;
    return value;
  }
  const [leftSearch, rightSearch] = [
    find({ tree: tree.left, value, returnNode }),
    find({ tree: tree.right, value, returnNode }),
  ];
  return leftSearch || rightSearch || false;
}

function deleteItem(value) {
  const tree = this;
  // we ask find method to return full reference to node
  let item = find({ tree, value, returnNode: true });
  if (!item) return false;
  // we pass refference to target item into rebind function
  rebindNode(item);
}

function rebindNode(treeNode) {
  const oldNode = treeNode;
  const isLeaf = !treeNode.left && !treeNode.right;

  const hasOneChild = Boolean(
    (!treeNode.left && treeNode.right) || (treeNode.left && !treeNode.right)
  );

  const hasTwoChildren = Boolean(treeNode.left && treeNode.right);

  if (isLeaf) {
    // if item is leaf, we can delete it without any worries
    treeNode = false;
    return oldNode;
  }

  if (hasOneChild) {
    // if node has only one child, we can replace it with child
    // actually, we just replace properties
    const treeNodeChild = treeNode.left || treeNode.right;
    treeNode.content = treeNodeChild.content;
    treeNode.left = treeNodeChild.left;
    treeNode.right = treeNodeChild.right;
    return oldNode;
  }

  if (hasTwoChildren) {
    // if node has two children, we need to find element that is only a bit greater than our node content (greaterNode)
    // it is done by searching right node (greaterNode) of our current node
    // and than finding last "left" node (lastLeft)

    let greaterNode = treeNode.right;
    let nextLeft = greaterNode.left;

    if (!nextLeft) {
      // if there's no left nodes after greaterNode, transfer content and right node of greaterNode
      treeNode.right = greaterNode.right;
      treeNode.content = greaterNode.content;
      return oldNode;
    }

    while (nextLeft.left) {
      nextLeft = nextLeft.left;
    }

    treeNode.content = nextLeft.content;
    nextLeft.content = false;
    nextLeft.left = false;
    nextLeft.right = false;
  }
}

function insert(value) {
  // with this function, we implement functionality of breadth-first search
  let treeNode = this;
  const queue = [treeNode];
  // the goal is to insert treeNode as a leaf to not break anything
  // the logic behind: start from root, and chech if value is greater or lower than root value;
  while (queue.length > 0) {
    // we do not check if content of node is equal to value
    // if nor value of current node is higher, nor lower then target value, stack just gets empty
    // so we end up exiting loop

    const currentItem = queue.shift();

    if (currentItem.content > value && currentItem.left)
      queue.push(currentItem.left);
    if (currentItem.content > value && !currentItem.left) {
      currentItem.left = node.create(value);
    }

    if (currentItem.content < value && currentItem.right)
      queue.push(currentItem.right);
    if (currentItem.content < value && !currentItem.right) {
      currentItem.right = node.create(value);
    }
  }
}

function levelOrder(callback = false) {
  // callback is another function that gets refference to traversed nodes
  const currentNode = this;
  const queue = [currentNode];

  const elements = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!callback) elements.push(node.content);
    else callback(node);
    const { left, right } = node;
    if (left) queue.push(left);
    if (right) queue.push(right);
  }

  if (!callback) return elements;
}

function preOrder(callback = false, treeNode = this, elements = []) {
  if (!treeNode && !callback) return elements;

  if (!treeNode && callback) return;

  const { left, right } = treeNode;

  if (callback) callback(treeNode);

  if (!callback) {
    elements.push(treeNode.content);
    return elements.concat(
      preOrder(callback, left, []),
      preOrder(callback, right, [])
    );
  }
  preOrder(callback, left, elements);
  preOrder(callback, right, elements);
}

function inOrder(callback = false, treeNode = this, elements = []) {
  if (!treeNode && !callback) return elements;

  if (!treeNode && callback) return;

  const { left, right } = treeNode;

  if (!callback) {
    elements = elements.concat(
      preOrder(callback, left, []),
      treeNode.content,
      preOrder(callback, right, [])
    );
    return elements;
  }

  preOrder(callback, left, elements);
  callback(treeNode);
  preOrder(callback, right, elements);
}

function postOrder(callback = false, treeNode = this, elements = []) {
  if (!treeNode && !callback) return elements;

  if (!treeNode && callback) return;

  const { left, right } = treeNode;

  if (!callback) {
    elements = elements.concat(
      postOrder(callback, left, []),

      postOrder(callback, right, []),

      treeNode.content
    );
    return elements;
  }

  postOrder(callback, left, elements);
  postOrder(callback, right, elements);
  callback(treeNode);
}

function height(treeNode = this) {
  // works simmilar to breadth first search
  let children = [];
  // it stores children in array instead of pushing them into stack
  let height = 0;
  // height will be returned when we'll run out of nodes to iterate
  let queue = [treeNode];

  while (queue.length > 0) {
    const lastNode = queue.shift();

    const { left, right } = lastNode;

    // if there is left/right node, push it to children
    if (left) children.push(left);
    if (right) children.push(right);

    if (queue.length < 1 && children.length > 0) {
      // if we run out of nodes in queue and there are children in next depth, push them to queue
      queue = queue.concat(children);
      // delete children
      children = [];
      // increase height
      height++;
    }

    // if there's no nodes in queue and no nodes in children, we finished iterating
    if (queue.length < 1 && children.length < 1) return height;
  }
}

function isBalanced(treeNode = this) {
  const [leftHeight, rightHeight] = [
    treeNode.height(treeNode.left),
    treeNode.height(treeNode.right),
  ];

  return leftHeight - rightHeight === 1 || leftHeight - rightHeight === -1;
}

function depth(treeNode = this, rootNode = this, level = 0) {
  if (treeNode === rootNode) return level;
  if (!treeNode) return level;

  const { left, right } = rootNode;

  level++;

  const [leftLevel, rightLevel] = [
    depth(left, treeNode, level),
    depth(right, treeNode, level),
  ];

  return leftLevel || rightLevel;
}


function rebalance(treeNode = this) {
  // I've decided to return new value instead of tweaking current
  // time complexity will be O(n log n)
  // idea is simple: Gather all values from the treeNode
  const nodeValues = treeNode.preOrder(); //returns array of values
  // then we sort values and create new tree

  // do not create tree if array of values is empty
  if (nodeValues.length < 1) return false;

  const balancedTree = tree.create(nodeValues); // mergeSort is already baked into create method. Time complexity is O(n log n)
  // return new tree
  return balancedTree;
}

const myTree = tree.create([
  8, 4, 13, 2, 6, 11, 16, 9
]);

// console.dir(myTree.find({ value: 5 }));

// myTree.postOrder((node) => {
//   console.dir(node.content);
// });

// myTree.deleteItem(5);

// console.dir(myTree);

console.dir(myTree.isBalanced());
// console.dir(myTree);
