import XCTest
import SwiftTreeSitter
import TreeSitterQl

final class TreeSitterQlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ql())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Ql grammar")
    }
}
