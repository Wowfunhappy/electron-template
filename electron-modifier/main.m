#import <AppKit/AppKit.h>
#import "ZKSwizzle.h"




@interface myNSFont : NSFont
@end

@implementation myNSFont

+ (NSFont *)systemFontOfSize:(CGFloat)fontSize weight:(CGFloat)weight {
	return [NSFont systemFontOfSize:fontSize];
}

@end




@implementation NSObject (main)

+ (void)load {
	ZKSwizzle(myNSFont, NSFont);
}

@end




int main() {}