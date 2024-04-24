function collisionDetection({
    object1,
    object2,
 }) {
    return (
       object1.position.y + object1.height >= object2.position.y && // Check if the bottom of object1 is above or at the same level as the top of object2
       object1.position.y <= object2.position.y + object2.height && // Check if the top of object1 is below or at the same level as the bottom of object2
       object1.position.x <= object2.position.x + object2.width && // Check if the left side of object1 is to the left or at the same level as the right side of object2
       object1.position.x + object1.width >= object2.position.x // Check if the right side of object1 is to the right or at the same level as the left side of object2
    );
 }