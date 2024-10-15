import XCTest
import SwiftTreeSitter
import TreeSitterQL

final class TreeSitterQLTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ql())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading QL grammar")
    }
}
